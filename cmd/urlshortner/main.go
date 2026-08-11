package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"golang.org/x/time/rate"

	"url-shortner/internal/app"
	"url-shortner/internal/store"
)

func main() {
	store.ConnectDB()
	defer store.DB.Close()

	secret := os.Getenv("JWT_SECRET")
	if len(secret) < 32 {
		log.Fatal("JWT_SECRET must be at least 32 characters")
	}

	rateLimiter := app.NewIPRateLimiter(rate.Limit(20), 40, 5*time.Minute)
	defer rateLimiter.Stop()

	mux := http.NewServeMux()
	mux.HandleFunc("/signup", app.SignupHandler(secret))
	mux.HandleFunc("/login", app.LoginHandler(secret))
	mux.Handle("/me", app.AuthMiddleware(secret, app.MeHandler()))
	mux.Handle("/links", app.AuthMiddleware(secret, http.HandlerFunc(app.ListLinksHandler())))
	mux.Handle("/links/create", app.AuthMiddleware(secret, http.HandlerFunc(app.CreateLinkHandler())))
	mux.HandleFunc("/r/", app.RedirectHandler())

	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", http.MethodGet)
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("URL shortener backend is running"))
	})

	handler := app.CORSMiddleware(app.RateLimitMiddleware(rateLimiter)(mux))

	server := &http.Server{
		Addr:              ":3000",
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Println("Starting server on port 3000 (Rate limiting enabled: 20 req/s, 40 burst)")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}
}
