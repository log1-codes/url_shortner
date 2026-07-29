package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

type URL struct {
	ID           string    `json:"id"`
	OriginalUrl  string    `json:"original_url"`
	ShortUrl     string    `json:"short_url"`
	CreationDate time.Time `json:"creation_date"`
}

var urlDB = make(map[string]URL)

func generateShortUrl(OriginalUrl string) string {
	hasher := md5.New()
	hasher.Write([]byte(OriginalUrl)) // it converts the originalURL string to a byte slice

	fmt.Println("hasher:", hasher)

	data := hasher.Sum(nil)
	fmt.Println("hasher data", data)

	hash := hex.EncodeToString(data)
	fmt.Println("EncodeToString", hash)

	fmt.Println("final String", hash[:8])
	return hash[:8]

}
func createUrl(OriginalUrl string) string {
	shortUrl := generateShortUrl(OriginalUrl)
	id := shortUrl //using short url as the id just for keeping it simple

	urlDB[id] = URL{
		ID:           id,
		OriginalUrl:  OriginalUrl,
		ShortUrl:     shortUrl,
		CreationDate: time.Now(),
	}
	return shortUrl
}

func getUrl(id string) (URL, error) {
	url, ok := urlDB[id]
	if !ok {
		return URL{}, errors.New("URL not found")
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
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}
	shortURL_ := createUrl(data.URL)
	// fmt.Fprintf(w, shortURL)

	response := struct {
		ShortURL string `json:"short_url"`
	}{ShortURL: shortURL_}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func redirectURLHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/redirect/"):]
	url, err := getUrl(id)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusNotFound)
	}
	http.Redirect(w, r, url.OriginalUrl, http.StatusFound)
}
func main() {
	// fmt.Println("starting url shortner")
	// OriginalUrl := "https://anurag.engineer"

	// generateShortUrl(OriginalUrl)

	//register the handler function to handle all requests to the root url("/")

	http.HandleFunc("/", handler)
	http.HandleFunc("/shorten", ShortUrlHandler)
	http.HandleFunc("/redirect/", redirectURLHandler)
	//start the http server on port 3000
	fmt.Println("Starting server on port 3000.........")

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Println("error on starting server", err)
	}

}
