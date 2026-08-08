package store

import (
    "context"
    "errors"

    "golang.org/x/crypto/bcrypt"
)
func HashPassword(password string)([]byte, error){
	return bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
}

func ComparePassword(hash []byte, password string) error {
    return bcrypt.CompareHashAndPassword(hash, []byte(password))
}

func CreateUser(email , password string)(User, error){
	pwHash , err := HashPassword(password)
	if err != nil { return User{}, err}

	var user User
	 err = DB.QueryRow(context.Background(),
        `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, password_hash, created_at`,
        email, string(pwHash),
    ).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
    if err != nil { return User{}, err }

	return user, nil 
}

func AuthenticateUser(email, password string) (User, error) {
    var user User
    err := DB.QueryRow(context.Background(),
        `SELECT id, email, password_hash, created_at FROM users WHERE email = $1`,
        email,
    ).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
    if err != nil { return User{}, err }

    if err := ComparePassword([]byte(user.PasswordHash), password); err != nil {
        return User{}, errors.New("invalid credentials")
    }

    return user, nil
}

func GetUserByID(userID string) (User, error) {
    var user User
    err := DB.QueryRow(context.Background(),
        `SELECT id, email, password_hash, created_at FROM users WHERE id = $1`,
        userID,
    ).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.CreatedAt)
    if err != nil {
        return User{}, err
    }
    return user, nil
}