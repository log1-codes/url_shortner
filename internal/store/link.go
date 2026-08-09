package store

import (
	"context"
	"errors"

	"github.com/jackc/pgconn"
)

const maxShortCodeAttempts = 5

func CreateLinkForUser(ctx context.Context, userID, originalURL string) (Link, error) {
	var lastErr error

	for range maxShortCodeAttempts {
		shortURL, err := GenerateShortURL()
		if err != nil {
			return Link{}, err
		}

		var link Link
		err = DB.QueryRow(ctx,
			`INSERT INTO links (id, user_id, original_url, short_url) VALUES ($1, $2, $3, $4)
	         RETURNING id, user_id, original_url, short_url, created_at`,
			shortURL, userID, originalURL, shortURL,
		).Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt)
		if err == nil {
			return link, nil
		}

		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			lastErr = err
			continue
		}

		return Link{}, err
	}

	return Link{}, lastErr
}

func GetLinksByUser(ctx context.Context, userID string) ([]Link, error) {
	rows, err := DB.Query(ctx,
		`SELECT l.id, l.user_id, l.original_url, l.short_url, l.created_at,
	                (
	                    SELECT COUNT(*)
	                      FROM clicks c
	                     WHERE c.link_id = l.id
	                ) AS clicks
	           FROM links l
	          WHERE l.user_id = $1
	          ORDER BY l.created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var links []Link
	for rows.Next() {
		var link Link
		if err := rows.Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt, &link.Clicks); err != nil {
			return nil, err
		}
		links = append(links, link)
	}
	return links, rows.Err()
}

func GetLinkByShortURL(ctx context.Context, shortURL string) (Link, error) {
	var link Link
	err := DB.QueryRow(ctx,
		`SELECT id, user_id, original_url, short_url, created_at FROM links WHERE short_url = $1`,
		shortURL,
	).Scan(&link.ID, &link.UserID, &link.OriginalURL, &link.ShortURL, &link.CreatedAt)
	if err != nil {
		return Link{}, err
	}
	return link, nil
}
