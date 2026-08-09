package store

import (
	"context"
	"crypto/rand"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

type URL struct {
    ID           string    `json:"id"`
    OriginalUrl  string    `json:"original_url"`
    ShortUrl     string    `json:"short_url"`
    CreationDate time.Time `json:"creation_date"`
}

const (
	shortCodeLength = 10
	shortCodeChars  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

func GenerateShortURL() (string, error) {
	buf := make([]byte, shortCodeLength)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	for i := range buf {
		buf[i] = shortCodeChars[int(buf[i])%len(shortCodeChars)]
	}

	return string(buf), nil
}

func GetURLByOriginal(ctx context.Context, originalUrl string) (URL, error) {
    var u URL

    err := DB.QueryRow(ctx,
        `SELECT id, original_url, short_url, creation_date FROM urls WHERE original_url = $1`,
        originalUrl).Scan(&u.ID, &u.OriginalUrl, &u.ShortUrl, &u.CreationDate)
    if err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return URL{}, errors.New("URL not found")
        }
        return URL{}, err
    }
    return u, nil
}

func CreateURL(ctx context.Context, originalUrl string) (string, error) {
    existing, err := GetURLByOriginal(ctx, originalUrl)
    if err == nil {
        return existing.ShortUrl, nil
    }
    if err.Error() != "URL not found" {
        return "", err
    }
    shortUrl, err := GenerateShortURL()
    if err != nil {
        return "", err
    }
    id := shortUrl
    _, err = DB.Exec(ctx,
        `INSERT INTO urls (id, original_url, short_url, creation_date) VALUES ($1, $2, $3, $4)`,
        id, originalUrl, shortUrl, time.Now(),
    )
    if err != nil {
        return "", err
    }
    return shortUrl, nil
}

func GetURL(ctx context.Context, id string) (URL, error) {
    var u URL
    err := DB.QueryRow(ctx,
        `SELECT id, original_url, short_url, creation_date FROM urls WHERE id = $1`,
        id,
    ).Scan(&u.ID, &u.OriginalUrl, &u.ShortUrl, &u.CreationDate)

    if err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return URL{}, errors.New("URL not found")
        }
        return URL{}, err
    }
    return u, nil
}
