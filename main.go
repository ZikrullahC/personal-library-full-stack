package main

import (
	"net/http"

	"github.com/ZikrullahC/go-personal-library-project/controllers"
	"github.com/ZikrullahC/go-personal-library-project/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	models.Init()

	router := gin.Default()

	router.Use(cors.Default())
	// HTML ve statik dosyaları sunma
	router.Static("/static", "./static")
	router.LoadHTMLGlob("templates/*")

	// CRUD işlemleri için API yolları
	router.POST("/books", controllers.CreateBook)
	router.GET("/books", controllers.GetBooks)
	router.GET("/books/:id", controllers.GetBooks)
	router.PUT("/books/:id", controllers.UpdateBook)
	router.DELETE("/books/:id", controllers.DeleteBook)

	// HTML dosyalarını sunma
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/addBook", func(c *gin.Context) {
		c.HTML(http.StatusOK, "addBook.html", nil)
	})
	router.GET("/viewLibrary", func(c *gin.Context) {
		c.HTML(http.StatusOK, "viewLibrary.html", nil)
	})
	router.GET("/updateBook", func(c *gin.Context) {
		c.HTML(http.StatusOK, "updateBook.html", nil)
	})
	// router.DELETE("/deleteBook", func(c *gin.Context) {
	// 	c.HTML(http.StatusOK, "deleteBook.html", nil)
	// })

	router.Run(":8080")
}
