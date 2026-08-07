# URL Shortener

A lightweight URL shortener built with Go and PostgreSQL. Submit a long URL, get an 8-character short code, and redirect visitors to the original link.

## Features

- Shorten URLs via a JSON REST API
- Redirect short codes to the original URL
- Persistent storage with PostgreSQL
- Automatic database table creation on startup
- Local development setup with Docker Compose

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Language   | Go 1.26                             |
| HTTP       | `net/http` (stdlib)                 |
| Database   | PostgreSQL 16                       |
| DB driver  | [pgx/v5](https://github.com/jackc/pgx) |
| Config     | [godotenv](https://github.com/joho/godotenv) |
| Containers | Docker Compose                      |

## Project Structure

```
url_shortner/
├── main.go            # HTTP server, handlers, and URL logic
├── db_connect.go      # Database connection and schema setup
├── docker-compose.yml # Local PostgreSQL container
├── go.mod
├── go.sum
└── .env               # Local config (not committed)
```

## How It Works

1. A client sends a `POST /shorten` request with a long URL.
2. The server hashes the URL with MD5 and takes the first 8 hex characters as the short code.
3. The mapping is stored in PostgreSQL.
4. Visiting `GET /redirect/{code}` looks up the original URL and returns an HTTP 302 redirect.

## Prerequisites

- [Go](https://go.dev/dl/) 1.26+
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/log1-codes/url_shortner.git
cd url_shortner
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container with:

| Setting  | Value        |
|----------|--------------|
| User     | `urlshortner` |
| Password | `urlshortner` |
| Database | `urlshortner` |
| Port     | `5432`       |

Data is persisted in a named Docker volume (`postgres_data`).

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://urlshortner:urlshortner@localhost:5432/urlshortner
```

> `.env` is listed in `.gitignore` and should never be committed.

### 4. Install dependencies

```bash
go mod download
```

### 5. Run the server

```bash
go run .
```

The server starts on **port 3000**. On startup it connects to PostgreSQL and creates the `urls` table if it does not exist.

## API Reference

### Health check

```
GET /
```

**Response:** plain text

```
Anurag's go server
```

---

### Shorten a URL

```
POST /shorten
Content-Type: application/json
```

**Request body:**

```json
{
  "url": "https://example.com/some/long/path"
}
```

**Success response (`200 OK`):**

```json
{
  "short_url": "a1b2c3d4"
}
```

**Error responses:**

| Status | Condition              |
|--------|------------------------|
| `400`  | Invalid request body   |
| `500`  | Database insert failed |

**Example:**

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

### Redirect to original URL

```
GET /redirect/{short_code}
```

**Success:** `302 Found` redirect to the original URL.

**Error responses:**

| Status | Condition        |
|--------|------------------|
| `404`  | Short code not found |

**Example:**

```bash
curl -L http://localhost:3000/redirect/a1b2c3d4
```

## Database Schema

The `urls` table is created automatically in `db_connect.go`:

```sql
CREATE TABLE IF NOT EXISTS urls (
    id            TEXT PRIMARY KEY,
    original_url  TEXT NOT NULL,
    short_url     TEXT NOT NULL,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Column          | Description                              |
|-----------------|------------------------------------------|
| `id`            | Short code (same as `short_url`)         |
| `original_url`  | The full URL submitted by the client     |
| `short_url`     | 8-character MD5 hash prefix              |
| `creation_date` | Timestamp when the URL was shortened     |

## Environment Variables

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string         |

Example:

```
postgres://<user>:<password>@<host>:<port>/<database>
```

## Docker Commands

```bash
# Start PostgreSQL in the background
docker compose up -d

# View logs
docker compose logs -f postgres

# Stop the container
docker compose down

# Stop and remove persisted data
docker compose down -v
```

## Build

Compile a binary:

```bash
go build -o url-shortner .
./url-shortner
```

## Known Limitations

- Short codes are derived from an MD5 hash of the URL. Submitting the same URL twice will fail with a primary key conflict.
- No input validation on URL format.
- No authentication or rate limiting.
- Uses a single database connection rather than a connection pool.

## License

MIT
