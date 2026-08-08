package app

import (
    "net/http"
    "strings"
	"context"
)

func AuthMiddleware(secret string, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        auth := r.Header.Get("Authorization")
        if auth == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        parts := strings.SplitN(auth, " ", 2)
        if len(parts) != 2 || parts[0] != "Bearer" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        claims, err := ParseToken(secret, parts[1])
        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        ctx := context.WithValue(r.Context(), "user_id", claims.UserID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

func UserIDFromContext(r *http.Request) string {
    if v := r.Context().Value("user_id"); v != nil {
        return v.(string)
    }
    return ""
}