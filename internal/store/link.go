package store

import (
    "context"
)

func CreateLinkForUser(userID, originalURL, shortURL string) (Link, error) {
    var link Link
    err := DB.QueryRow(context.Background(),
        `INSERT INTO links (id, user_id, original_url, short_url) VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, original_url, short_url, created_at`,
        shortURL, userID, originalURL, shortURL,
    ).Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt)
    if err != nil {
        return Link{}, err
    }
    return link, nil
}

func GetLinksByUser(userID string) ([]Link, error) {
    rows, err := DB.Query(context.Background(),
        `SELECT id, user_id, original_url, short_url, created_at FROM links WHERE user_id = $1 ORDER BY created_at DESC`,
        userID,
    )
    if err != nil { return nil, err }
    defer rows.Close()

    var links []Link
    for rows.Next() {
        var link Link
        if err := rows.Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt); err != nil {
            return nil, err
        }
        links = append(links, link)
    }
    return links, nil
}

func GetLinkByShortURL(shortURL string) (Link, error) {
    var link Link
    err := DB.QueryRow(context.Background(),
        `SELECT id, user_id, original_url, short_url, created_at FROM links WHERE short_url = $1`,
        shortURL,
    ).Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt)
    if err != nil {
        return Link{}, err
    }
    return link, nil
}