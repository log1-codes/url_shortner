package store

import (
    "context"
    "log"
    "os"
    "time"

    "github.com/jackc/pgx/v5"
    "github.com/joho/godotenv"
)

var DB *pgx.Conn

// ConnectDB establishes a database connection and assigns it to store.DB
func ConnectDB() *pgx.Conn {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }

    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        log.Fatal("DATABASE_URL is not set")
    }

    conn, err := pgx.Connect(context.Background(), connStr)
    if err != nil {
        log.Fatal("Unable to connect to database:", err)
    }

    // create table if not exists (safe for initial setup)
    _, err = conn.Exec(context.Background(), `
        CREATE TABLE IF NOT EXISTS urls (
            id TEXT PRIMARY KEY,
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL,
            creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `)
    if err != nil {
        conn.Close(context.Background())
        log.Fatal("Unable to create urls table:", err)
    }

    DB = conn

    // small delay to allow pg to be ready in some environments
    time.Sleep(100 * time.Millisecond)

    return DB
}
