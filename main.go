package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
)

type URL struct {
	ID           string    `json:"id"`
	OriginalUrl  string    `json:"original_url"`
	ShortUrl     string    `json:"short_url"`
	CreationDate time.Time `json:"creation_date"`
}

var db *pgx.Conn

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Anurag's go server")
}

func ShortUrlHandler(w http.ResponseWriter, r *http.Request) {
	var data struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}

	if !isValidURL(data.URL) {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	shortURL, err := createUrl(data.URL)
	if err != nil {
		http.Error(w, "Failed to create short URL", http.StatusInternalServerError)
		return
	}

	response := struct {
		ShortURL string `json:"short_url"`
	}{ShortURL: shortURL}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func redirectURLHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/redirect/"):]
	url, err := getUrl(id)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusNotFound)
		return
	}
	http.Redirect(w, r, url.OriginalUrl, http.StatusFound)
}

func main() {
	db = connectDB()
	defer db.Close(context.Background())

	http.HandleFunc("/", handler)
	http.HandleFunc("/shorten", ShortUrlHandler)
	http.HandleFunc("/redirect/", redirectURLHandler)

	fmt.Println("Starting server on port 3000.........")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		fmt.Println("error on starting server", err)
	}
}
