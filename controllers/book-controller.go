package controllers

import (
	"net/http"

	"github.com/ZikrullahC/go-personal-library-project/models"
	"github.com/gin-gonic/gin"
)

// CreateBook creates a new book
func CreateBook(c *gin.Context) {
	var book models.Book

	if err := c.BindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.Db.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, book)
}

// getBook handler function
func GetBook(c *gin.Context) {
	bookId := c.Query("id")
	var book models.Book

	// Veritabanından bookId'ye göre kitabı çekin
	if err := models.Db.Where("id = ?", bookId).First(&book).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kitap bulunamadı"})
		return
	}

	c.JSON(http.StatusOK, book)
}

// GetBooks gets the list of all books
func GetBooks(c *gin.Context) {
	var books []models.Book
	models.Db.Find(&books)
	c.JSON(http.StatusOK, books)
}

// UpdateBook updates an existing book
func UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	if err := models.Db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kitap bulunamadı"})
		return
	}

	// Form verilerini bağla
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.Db.Save(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Kitap güncellenirken bir hata oluştu: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, book)
}

// DeleteBook deletes an existing book
func DeleteBook(c *gin.Context) {
	var book models.Book
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz kitap ID"})
		return
	}

	if err := models.Db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kitap bulunamadı"})
		return
	}

	models.Db.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"message": "Kitap başarıyla silindi"})
}
