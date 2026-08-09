package store

import (
	"context"
	"errors"

	"github.com/jackc/pgconn"
	"golang.org/x/crypto/bcrypt"
)

var ErrEmailAlreadyExists = errors.New("email already exists")

func HashPassword(password string) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}

func ComparePassword(hash []byte, password string) error {
	return bcrypt.CompareHashAndPassword(hash, []byte(password))
}

func CreateUser(ctx context.Context, email, password string) (User, error) {
	pwHash, err := HashPassword(password)
	if err != nil {
		return User{}, err
	}

	var user User
	err = DB.QueryRow(ctx,
		`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at`,
		email, string(pwHash),
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return User{}, ErrEmailAlreadyExists
		}
		return User{}, err
	}

	return user, nil
}

func AuthenticateUser(ctx context.Context, email, password string) (User, error) {
	var user User
	err := DB.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at FROM users WHERE email = $1`,
		email,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil {
		return User{}, err
	}

	if err := ComparePassword([]byte(user.PasswordHash), password); err != nil {
		return User{}, errors.New("invalid credentials")
	}

	return user, nil
}

func GetUserByID(ctx context.Context, userID string) (User, error) {
	var user User
	err := DB.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil {
		return User{}, err
	}
	return user, nil
}
