// package main

// import (
//     "context"
//     "encoding/json"
//     "fmt"
//     "net/http"

//     "url-shortner/internal/app"
//     "url-shortner/internal/store"
// )

// func handler(w http.ResponseWriter, r *http.Request) {
//     fmt.Fprintf(w, "Anurag's go server")
// }

// func ShortUrlHandler(w http.ResponseWriter, r *http.Request) {
//     var data struct {
//         URL string `json:"url"`
//     }
//     if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
//         http.Error(w, "Invalid Request Body", http.StatusBadRequest)
//         return
//     }

//     if !app.IsValidURL(data.URL) {
//         http.Error(w, "Invalid URL", http.StatusBadRequest)
//         return
//     }

//     shortURL, err := store.CreateURL(data.URL)
//     if err != nil {
//         http.Error(w, "Failed to create short URL", http.StatusInternalServerError)
//         return
//     }

//     response := struct {
//         ShortURL string `json:"short_url"`
//     }{ShortURL: shortURL}
//     w.Header().Set("Content-Type", "application/json")
//     json.NewEncoder(w).Encode(response)
// }

// func redirectURLHandler(w http.ResponseWriter, r *http.Request) {
//     id := r.URL.Path[len("/redirect/"):]
//     u, err := store.GetURL(id)
//     if err != nil {
//         http.Error(w, "Invalid Request", http.StatusNotFound)
//         return
//     }
//     http.Redirect(w, r, u.OriginalUrl, http.StatusFound)
// }

// func main() {
//     store.ConnectDB()
//     defer store.DB.Close(context.Background())

//     http.HandleFunc("/", handler)
//     http.HandleFunc("/shorten", ShortUrlHandler)
//     http.HandleFunc("/redirect/", redirectURLHandler)

//     fmt.Println("Starting server on port 3000.........")
//     if err := http.ListenAndServe(":3000", nil); err != nil {
//         fmt.Println("error on starting server", err)
//     }
// }
package main

import (
    "context"
    "log"
    "net/http"
    "os"

    "url-shortner/internal/app"
    "url-shortner/internal/store"
)

func main() {
    store.ConnectDB()
    defer store.DB.Close(context.Background())

    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        log.Fatal("JWT_SECRET is required")
    }

    mux := http.NewServeMux()
    mux.HandleFunc("/signup", app.SignupHandler(secret))
    mux.HandleFunc("/login", app.LoginHandler(secret))
    mux.Handle("/me", app.AuthMiddleware(secret, app.MeHandler()))
    mux.Handle("/links", app.AuthMiddleware(secret, http.HandlerFunc(app.ListLinksHandler())))
    mux.Handle("/links/create", app.AuthMiddleware(secret, http.HandlerFunc(app.CreateLinkHandler())))
    mux.HandleFunc("/r/", app.RedirectHandler())

    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("URL shortener backend is running"))
})
    log.Println("Starting server on port 3000")
    if err := http.ListenAndServe(":3000", mux); err != nil {
        log.Fatal(err)
    }
}