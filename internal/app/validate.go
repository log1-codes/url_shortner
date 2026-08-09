package app

import (
	"net/mail"
	"net/netip"
	"net/url"
	"strings"
	"unicode"
)

const maxOriginalURLLength = 2048
const minPasswordLength = 8

func IsValidEmail(raw string) bool {
	email := strings.TrimSpace(raw)
	if email == "" || len(email) > 254 {
		return false
	}

	addr, err := mail.ParseAddress(email)
	return err == nil && addr.Address == email
}

func IsValidPassword(raw string) bool {
	return len(raw) >= minPasswordLength && len(raw) <= 1024
}

func IsValidURL(raw string) bool {
	raw = strings.TrimSpace(raw)
	if raw == "" || len(raw) > maxOriginalURLLength {
		return false
	}

	if strings.ContainsFunc(raw, func(r rune) bool {
		return unicode.IsControl(r) || unicode.IsSpace(r)
	}) {
		return false
	}

	parsed, err := url.ParseRequestURI(raw)
	if err != nil {
		return false
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return false
	}

	if parsed.User != nil || parsed.Host == "" {
		return false
	}

	host := strings.ToLower(strings.TrimSuffix(parsed.Hostname(), "."))
	if host == "" {
		return false
	}

	if ip, err := netip.ParseAddr(host); err == nil {
		return isPublicIP(ip)
	}

	return true
}

func isPublicIP(ip netip.Addr) bool {
	return !ip.IsPrivate() &&
		!ip.IsLoopback() &&
		!ip.IsLinkLocalUnicast() &&
		!ip.IsLinkLocalMulticast() &&
		!ip.IsMulticast() &&
		!ip.IsUnspecified()
}
