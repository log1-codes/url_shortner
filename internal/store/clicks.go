package store
import (
	"context"
	"time"
)

func RecordClick(linkID, userAgent, ip string) error {
	_, err := DB.Exec(context.Background(),
`INSERT INTO clicks (link_id, user_agent , ip , clicked_at) VALUES ($1, $2, $3, $4)`,
linkID, userAgent, ip, time.Now(),

)
return err
}

func CountClicksForLink(linkID string )(int ,error){
	var count int 
	err := DB.QueryRow(context.Background(), 
`SELECT COUNT(*) FROM clicks WHERE link_id = $1`, linkID).Scan(&count)
return count, err 
}