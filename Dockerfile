FROM golang:1.20 AS builder
WORKDIR /src

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy sources and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/urlshortner ./cmd/urlshortner

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /out/urlshortner /usr/local/bin/urlshortner
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/urlshortner"]
