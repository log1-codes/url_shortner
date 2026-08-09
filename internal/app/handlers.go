package app

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"url-shortner/internal/store"
)

type signupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type createLinkRequest struct {
	OriginalURL string `json:"original_url"`
}

const maxJSONBodySize = 1 << 20

func writeJSON(w http.ResponseWriter, status int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	_ = writeJSON(w, status, map[string]string{"error": message})
}

func requireMethod(w http.ResponseWriter, r *http.Request, method string) bool {
	if r.Method == method {
		return true
	}
	w.Header().Set("Allow", method)
	writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
	return false
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, maxJSONBodySize)

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return false
	}

	var extra any
	if err := decoder.Decode(&extra); !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return false
	}

	return true
}

func SignupHandler(secret string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodPost) {
			return
		}

		var req signupRequest
		if !decodeJSON(w, r, &req) {
			return
		}

		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		if req.Email == "" || req.Password == "" {
			writeError(w, http.StatusBadRequest, "Email and password are required")
			return
		}

		user, err := store.CreateUser(r.Context(), req.Email, req.Password)
		if err != nil {
			if errors.Is(err, store.ErrEmailAlreadyExists) {
				writeError(w, http.StatusConflict, "Email already exists")
				return
			}
			writeError(w, http.StatusInternalServerError, "Unable to create user")
			return
		}

		token, err := GenerateToken(secret, user.ID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to generate token")
			return
		}

		if err := writeJSON(w, http.StatusOK, map[string]string{"token": token}); err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to write response")
		}
	}
}

func LoginHandler(secret string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodPost) {
			return
		}

		var req loginRequest
		if !decodeJSON(w, r, &req) {
			return
		}

		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		if req.Email == "" || req.Password == "" {
			writeError(w, http.StatusBadRequest, "Email and password are required")
			return
		}

		user, err := store.AuthenticateUser(r.Context(), req.Email, req.Password)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "Invalid credentials")
			return
		}

		token, err := GenerateToken(secret, user.ID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to generate token")
			return
		}

		if err := writeJSON(w, http.StatusOK, map[string]string{"token": token}); err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to write response")
		}
	}
}

func MeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodGet) {
			return
		}

		userID := UserIDFromContext(r)
		if userID == "" {
			writeError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		user, err := store.GetUserByID(r.Context(), userID)
		if err != nil {
			writeError(w, http.StatusNotFound, "User not found")
			return
		}

		if err := writeJSON(w, http.StatusOK, user); err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to write response")
		}
	}
}

func CreateLinkHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodPost) {
			return
		}

		userID := UserIDFromContext(r)
		if userID == "" {
			writeError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		var req createLinkRequest
		if !decodeJSON(w, r, &req) {
			return
		}

		req.OriginalURL = strings.TrimSpace(req.OriginalURL)
		if !IsValidURL(req.OriginalURL) {
			writeError(w, http.StatusBadRequest, "Invalid URL")
			return
		}

		link, err := store.CreateLinkForUser(r.Context(), userID, req.OriginalURL)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to create link")
			return
		}

		if err := writeJSON(w, http.StatusOK, link); err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to write response")
		}
	}
}

func ListLinksHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodGet) {
			return
		}

		userID := UserIDFromContext(r)
		if userID == "" {
			writeError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		links, err := store.GetLinksByUser(r.Context(), userID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to fetch links")
			return
		}

		if err := writeJSON(w, http.StatusOK, links); err != nil {
			writeError(w, http.StatusInternalServerError, "Unable to write response")
		}
	}
}

func RedirectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !requireMethod(w, r, http.MethodGet) {
			return
		}

		slug := strings.TrimPrefix(r.URL.Path, "/r/")
		link, err := store.GetLinkByShortURL(r.Context(), slug)
		if err != nil {
			http.NotFound(w, r)
			return
		}

		_ = store.RecordClick(r.Context(), link.ID, r.UserAgent(), r.RemoteAddr)
		http.Redirect(w, r, link.OriginalURL, http.StatusFound)
	}
}

func LinkStatsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// parse link id or slug from URL
		// verify ownership using userID
		// return count + maybe recent clicks
	}
}
