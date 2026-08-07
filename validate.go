package main

import (
	"net/url"
	"strings"
)

func isValidURL(raw string) bool {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return false
	}

	parsed, err := url.Parse(raw)
	if err != nil {
		return false
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return false
	}

	if parsed.Host == "" {
		return false
	}
	return true
}
