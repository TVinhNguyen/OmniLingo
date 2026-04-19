package anki

import "os"

// createFile creates a new file for writing.
func createFile(path string) (*os.File, error) {
	return os.Create(path)
}
