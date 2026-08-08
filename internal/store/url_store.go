package store

import (
    "context"
    "crypto/md5"
    "encoding/hex"
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

func generateShortURL(originalUrl string) string {
    hasher := md5.New()
    hasher.Write([]byte(originalUrl))
    hash := hex.EncodeToString(hasher.Sum(nil))
    return hash[:8]
}

func GetURLByOriginal(originalUrl string) (URL, error) {
    var u URL

    err := DB.QueryRow(context.Background(),
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

func CreateURL(originalUrl string) (string, error) {
    existing, err := GetURLByOriginal(originalUrl)
    if err == nil {
        return existing.ShortUrl, nil
    }
    if err.Error() != "URL not found" {
        return "", err
    }
    shortUrl := generateShortURL(originalUrl)
    id := shortUrl
    _, err = DB.Exec(context.Background(),
        `INSERT INTO urls (id, original_url, short_url, creation_date) VALUES ($1, $2, $3, $4)`,
        id, originalUrl, shortUrl, time.Now(),
    )
    if err != nil {
        return "", err
    }
    return shortUrl, nil
}

func GetURL(id string) (URL, error) {
    var u URL
    err := DB.QueryRow(context.Background(),
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
