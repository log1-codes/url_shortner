package app

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// client represents a rate-limited client with its token bucket limiter and last active timestamp.
type client struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// IPRateLimiter manages per-IP token bucket rate limiters with thread-safe access
// and automatic periodic cleanup of stale clients to prevent memory leaks.
type IPRateLimiter struct {
	mu      sync.RWMutex
	clients map[string]*client
	r       rate.Limit
	b       int
	cleanup time.Duration
	stopCh  chan struct{}
}

// NewIPRateLimiter initializes an IPRateLimiter:
// - r: Refill rate in tokens per second (e.g., rate.Limit(20) = 20 requests/sec).
// - b: Maximum burst token capacity (e.g., 30 tokens).
// - cleanupInterval: Duration between background sweeps removing inactive IPs.
func NewIPRateLimiter(r rate.Limit, b int, cleanupInterval time.Duration) *IPRateLimiter {
	limiter := &IPRateLimiter{
		clients: make(map[string]*client),
		r:       r,
		b:       b,
		cleanup: cleanupInterval,
		stopCh:  make(chan struct{}),
	}

	go limiter.cleanupLoop()

	return limiter
}

// GetClientLimiter returns the rate.Limiter for a given IP, creating one if it doesn't exist.
func (i *IPRateLimiter) GetClientLimiter(ip string) *rate.Limiter {
	i.mu.Lock()
	defer i.mu.Unlock()

	c, exists := i.clients[ip]
	if !exists {
		lim := rate.NewLimiter(i.r, i.b)
		i.clients[ip] = &client{
			limiter:  lim,
			lastSeen: time.Now(),
		}
		return lim
	}

	c.lastSeen = time.Now()
	return c.limiter
}

// cleanupLoop periodically evicts clients that haven't made requests within the cleanup interval.
func (i *IPRateLimiter) cleanupLoop() {
	ticker := time.NewTicker(i.cleanup)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			i.mu.Lock()
			for ip, c := range i.clients {
				if time.Since(c.lastSeen) > i.cleanup {
					delete(i.clients, ip)
				}
			}
			i.mu.Unlock()
		case <-i.stopCh:
			return
		}
	}
}

// Stop terminates the background cleanup goroutine.
func (i *IPRateLimiter) Stop() {
	close(i.stopCh)
}

// ClientCount returns the current number of tracked IP entries (useful for monitoring/testing).
func (i *IPRateLimiter) ClientCount() int {
	i.mu.RLock()
	defer i.mu.RUnlock()
	return len(i.clients)
}

// ExtractIP retrieves the client IP address by inspecting common proxy headers
// (X-Forwarded-For, X-Real-IP) before falling back to RemoteAddr.
func ExtractIP(r *http.Request) string {
	// Check X-Forwarded-For header (first entry is the client IP)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		if len(ips) > 0 {
			ip := strings.TrimSpace(ips[0])
			if ip != "" {
				return ip
			}
		}
	}

	// Check X-Real-IP header
	if xrip := r.Header.Get("X-Real-IP"); xrip != "" {
		ip := strings.TrimSpace(xrip)
		if ip != "" {
			return ip
		}
	}

	// Fallback to RemoteAddr (strip port if present)
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return strings.TrimSpace(r.RemoteAddr)
	}
	return host
}

// RateLimitMiddleware wraps an http.Handler with per-IP rate limiting.
// If the request exceeds the limit, it responds with HTTP 429 Too Many Requests and a Retry-After header.
func RateLimitMiddleware(limiter *IPRateLimiter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := ExtractIP(r)
			clientLimiter := limiter.GetClientLimiter(ip)

			if !clientLimiter.Allow() {
				w.Header().Set("Retry-After", "1")
				writeError(w, http.StatusTooManyRequests, "Too many requests. Please try again later.")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
