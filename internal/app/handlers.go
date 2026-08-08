package app
import (
	"encoding/json"
	"net/http"
	"url-shortner/internal/store"
	"strings"
)

type signupRequest struct {
	Email 		string 		`json:"email"`
	Password 	string 		`json:"password"`
}
func SignupHandler(secret string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req signupRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Bad request", http.StatusBadRequest)
            return
        }

        user, err := store.CreateUser(req.Email, req.Password)
        if err != nil {
            http.Error(w, "Unable to create user", http.StatusInternalServerError)
            return
        }

        token, err := GenerateToken(secret, user.ID)
        if err != nil {
            http.Error(w, "Unable to generate token", http.StatusInternalServerError)
            return
        }

        json.NewEncoder(w).Encode(map[string]string{"token": token})
    }
}


type loginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

func LoginHandler(secret string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req loginRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Bad request", http.StatusBadRequest)
            return
        }
        user, err := store.AuthenticateUser(req.Email, req.Password)
        if err != nil {
            http.Error(w, "Invalid credentials", http.StatusUnauthorized)
            return
        }
        token, err := GenerateToken(secret, user.ID)
        if err != nil {
            http.Error(w, "Unable to generate token", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(map[string]string{"token": token})
    }
}


func MeHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := UserIDFromContext(r)
        if userID == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        user, err := store.GetUserByID(userID)
        if err != nil {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        json.NewEncoder(w).Encode(user)
    }
}



type createLinkRequest struct {
    OriginalURL string `json:"original_url"`
}

func CreateLinkHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := UserIDFromContext(r)
        var req createLinkRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Bad request", http.StatusBadRequest)
            return
        }
        short := store.GenerateShortURL(req.OriginalURL)
        link, err := store.CreateLinkForUser(userID, req.OriginalURL, short)
        if err != nil {
            http.Error(w, "Unable to create link", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(link)
    }
}

func ListLinksHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := UserIDFromContext(r)
        links, err := store.GetLinksByUser(userID)
        if err != nil {
            http.Error(w, "Unable to fetch links", http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(links)
    }
}


func RedirectHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        slug := strings.TrimPrefix(r.URL.Path, "/r/")
        link, err := store.GetLinkByShortURL(slug)
        if err != nil {
            http.NotFound(w, r)
            return
        }
        _ = store.RecordClick(link.ID, r.UserAgent(), r.RemoteAddr)
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
