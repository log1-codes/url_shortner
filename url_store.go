package main

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

func generateShortUrl(originalUrl string) string {
	hasher := md5.New()
	hasher.Write([]byte(originalUrl))
	hash := hex.EncodeToString(hasher.Sum(nil))
	return hash[:8]
}

func getUrlByOriginal(originalUrl string) (URL, error) {
	var url URL

	err := db.QueryRow(context.Background(),
		`SELECT id, original_url , short_url , creation_date FROM urls WHERE original_url = $1`,
		originalUrl).Scan(&url.ID, &url.OriginalUrl, &url.ShortUrl, &url.CreationDate)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return URL{}, errors.New("URL not found")
		}
		return URL{}, err
	}
	return url, nil
}

func createUrl(originalUrl string) (string, error) {
	existing, err := getUrlByOriginal(originalUrl)
	if err == nil {
		return existing.ShortUrl, nil
	}
	if err.Error() != "URL not found" {
		return "", err
	}
	shortUrl := generateShortUrl(originalUrl)
	id := shortUrl
	_, err = db.Exec(context.Background(),
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
