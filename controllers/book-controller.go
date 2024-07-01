package controllers

import (
	"fmt"
	"net/http"

	"github.com/ZikrullahC/go-personal-library-project/models"
	"github.com/gin-gonic/gin"
)

// CreateBook creates a new book
func CreateBook(c *gin.Context) {
	var book models.Book

	if err := c.BindJSON(&book); err != nil {
		fmt.Println("JSON Parse Hatası 1:", err) // Hata mesajını konsola yazdır
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Gelen İstek: %+v\n", book)

	if err := models.Db.Create(&book).Error; err != nil {
		fmt.Println("Veritabanı Hatası:", err) // Hata mesajını konsola yazdır
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, book)
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
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz kitap ID"})
		return
	}

	var book models.Book
	if err := models.Db.First(&book, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kitap bulunamadı"})
		return
	}

	var updatedBook models.Book
	if err := c.ShouldBindJSON(&updatedBook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Sadece gelen verileri güncelle
	if updatedBook.Name != "" {
		book.Name = updatedBook.Name
	}
	if updatedBook.Author != "" {
		book.Author = updatedBook.Author
	}
	if updatedBook.PublicationYear != 0 {
		book.PublicationYear = updatedBook.PublicationYear
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
