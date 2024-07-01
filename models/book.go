package models

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

type Book struct {
	gorm.Model
	Name            string `json:"name"`
	Author          string `json:"author"`
	PublicationYear int    `json:"publication_year"`
}

// Init fonksiyonu veritabani baglantisini duzgun sekilde baslatarak db degiskenine diger dosyalardan da
// erisilmesini saglar.
func Init() {
	var err error

	dsn := "your_database_connection_name:password@tcp(localhost:3306)/your_database_name?charset=utf8mb4&parseTime=True&loc=Local"
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	Db.AutoMigrate(&Book{})
}
