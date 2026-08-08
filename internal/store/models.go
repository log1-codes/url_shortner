package store

import "time"

type User struct {
    ID           string    `json:"id"`
    Email        string    `json:"email"`
    PasswordHash string    `json:"-"`
    CreatedAt    time.Time `json:"created_at"`
}

type Link struct {
    ID          string    `json:"id"`
    UserID      string    `json:"user_id"`
    OriginalURL string    `json:"original_url"`
    ShortURL    string    `json:"short_url"`
    CreatedAt   time.Time `json:"created_at"`
}

type Click struct {
    ID        int64     `json:"id"`
    LinkID    string    `json:"link_id"`
    ClickedAt time.Time `json:"clicked_at"`
    UserAgent string    `json:"user_agent"`
    IP        string    `json:"ip"`
}