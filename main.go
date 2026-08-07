package main

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
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

func generateShortUrl(originalUrl string) string {
	hasher := md5.New()
	hasher.Write([]byte(originalUrl))
	hash := hex.EncodeToString(hasher.Sum(nil))
	return hash[:8]
}

func createUrl(originalUrl string) (string, error) {
	shortUrl := generateShortUrl(originalUrl)
	id := shortUrl

	_, err := db.Exec(context.Background(),
		`INSERT INTO urls (id, original_url, short_url, creation_date) VALUES ($1, $2, $3, $4)`,
		id, originalUrl, shortUrl, time.Now(),
	)
	if err != nil {
		return "", err
	}
	return shortUrl, nil
}

func getUrl(id string) (URL, error) {
	var url URL
	err := db.QueryRow(context.Background(),
		`SELECT id, original_url, short_url, creation_date FROM urls WHERE id = $1`,
		id,
	).Scan(&url.ID, &url.OriginalUrl, &url.ShortUrl, &url.CreationDate)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return URL{}, errors.New("URL not found")
		}
		return URL{}, err
	}
	return url, nil
}

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
