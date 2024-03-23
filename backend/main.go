package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// max upload file size 3gb
	router.MaxMultipartMemory = 3 << 30 // 3gb

	router.POST("/upload", func(ctx *gin.Context) {
		form, _ := ctx.MultipartForm()
		files := form.File["upload"]

		for _, file := range files {
			// TODO: change to s3
			ctx.SaveUploadedFile(file, "uploads/"+file.Filename)
		}

		ctx.JSON(200, fmt.Sprintf("%d files uploaded!", len(files)))
	})

	router.Run()
}
