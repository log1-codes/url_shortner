package store

import (
	"context"
	"time"
)

func RecordClick(ctx context.Context, linkID, userAgent, ip string) error {
	_, err := DB.Exec(ctx,
		`INSERT INTO clicks (link_id, user_agent, ip, clicked_at) VALUES ($1, $2, $3, $4)`,
		linkID, userAgent, ip, time.Now(),

	)
	return err
}

func CountClicksForLink(ctx context.Context, linkID string) (int, error) {
	var count int
	err := DB.QueryRow(ctx,
		`SELECT COUNT(*) FROM clicks WHERE link_id = $1`, linkID).Scan(&count)
	return count, err
}
