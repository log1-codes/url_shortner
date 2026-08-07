package main

import "testing"

func TestISValidURL(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  bool
	}{
		{name: "valid https", input: "https://example.com", want: true},
		{name: "valid http with path", input: "http://example.com/path?q=1", want: true},
		{name: "valid with port", input: "https://localhost:8080/api", want: true},
		{name: "empty string", input: "", want: false},
		{name: "whitespace only", input: "   ", want: false},
		{name: "missing scheme", input: "example.com", want: false},
		{name: "invalid scheme ftp", input: "ftp://example.com", want: false},
		{name: "no host", input: "https://", want: false},
		{name: "plain text", input: "not-a-url", want: false},
		{name: "javascript scheme", input: "javascript:alert(1)", want: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := isValidURL(tt.input)
			if got != tt.want {
				t.Errorf("isValidURL(%q)=%v, want %v", tt.input, got, tt.want)
			}
		})
	}
}
