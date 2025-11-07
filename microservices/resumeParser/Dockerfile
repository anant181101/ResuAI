FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download || true
COPY . .
RUN go build -o /resume-parser

FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache poppler-utils
COPY --from=builder /resume-parser /resume-parser
EXPOSE 8081
CMD ["/resume-parser"]
