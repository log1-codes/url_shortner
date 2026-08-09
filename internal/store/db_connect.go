package store

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

func ConnectDB() *pgxpool.Pool {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL is required")
	}

	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	_, err = pool.Exec(context.Background(), `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)
	if err != nil {
		pool.Close()
		log.Fatal("Unable to create pgcrypto extension:", err)
	}

	_, err = pool.Exec(context.Background(), `
	        CREATE TABLE IF NOT EXISTS users (
	            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	            email TEXT NOT NULL UNIQUE,
	            password_hash TEXT NOT NULL,
	            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	        );

	        CREATE TABLE IF NOT EXISTS links (
	            id TEXT PRIMARY KEY,
	            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	            original_url TEXT NOT NULL,
	            short_url TEXT NOT NULL UNIQUE,
	            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	        );

        CREATE TABLE IF NOT EXISTS clicks (
            id BIGSERIAL PRIMARY KEY,
            link_id TEXT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
            user_agent TEXT,
            ip TEXT,
            clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

	        CREATE TABLE IF NOT EXISTS urls (
	            id TEXT PRIMARY KEY,
	            original_url TEXT NOT NULL,
	            short_url TEXT NOT NULL UNIQUE,
	            creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
	        );

	        CREATE INDEX IF NOT EXISTS idx_links_user_created_at ON links(user_id, created_at DESC);
	        CREATE INDEX IF NOT EXISTS idx_links_short_url ON links(short_url);
	        CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
	    `)
	if err != nil {
		pool.Close()
		log.Fatal("Unable to create database schema:", err)
	}

	DB = pool

	time.Sleep(100 * time.Millisecond)

	return DB
}
