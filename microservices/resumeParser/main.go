package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"unicode/utf8"
)

type ParseResponse struct {
	ExtractedText string   `json:"extractedText"`
	Keywords      []string `json:"keywords"`
	KeywordScore  float64  `json:"keywordScore"`
	Matched       []string `json:"matched"`
	Missing       []string `json:"missing"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" { port = "8081" }
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"ok":true}`))
	})

	http.HandleFunc("/parse", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := r.ParseMultipartForm(25 << 20); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"invalid_form"}`))
			return
		}
		var text string
		if file, header, err := r.FormFile("resume"); err == nil {
			defer file.Close()
			b, _ := io.ReadAll(file)
			fname := strings.ToLower(header.Filename)
			ctype := strings.ToLower(header.Header.Get("Content-Type"))
			if strings.HasSuffix(fname, ".pdf") || strings.Contains(ctype, "pdf") {
				// try pdftotext for robust PDF extraction
				tmp, _ := os.CreateTemp("", "resuai-*.pdf")
				_, _ = tmp.Write(b)
				_ = tmp.Close()
				cmd := exec.Command("pdftotext", "-layout", tmp.Name(), "-")
				out, err := cmd.Output()
				_ = os.Remove(tmp.Name())
				if err == nil && utf8.Valid(out) {
					text = string(out)
				}
			}
			if text == "" {
				if utf8.Valid(b) { text = string(b) } else { text = fmt.Sprintf("(binary file: %s, %d bytes)", header.Filename, len(b)) }
			}
		}
		if t := r.FormValue("text"); t != "" {
			text = t
		}
		text = strings.TrimSpace(text)
		lower := strings.ToLower(text)
		keywords := []string{"javascript", "react", "node", "python", "go", "aws", "docker", "kubernetes", "sql", "leadership"}
		matched := make([]string, 0)
		missing := make([]string, 0)
		for _, k := range keywords {
			re := regexp.MustCompile(`\b` + regexp.QuoteMeta(k) + `\b`)
			if re.MatchString(lower) { matched = append(matched, k) } else { missing = append(missing, k) }
		}
		score := float64(len(matched)) / float64(len(keywords)) * 100.0
		resp := ParseResponse{ ExtractedText: text, Keywords: keywords, KeywordScore: score, Matched: matched, Missing: missing }
		json.NewEncoder(w).Encode(resp)
	})

	log.Printf("[resumeParser] listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
