document.addEventListener("DOMContentLoaded", function() {

    var viewLibraryButton = document.getElementById("viewLibrary");
    viewLibraryButton.addEventListener("click", function() {
        console.log("viewLibrary butonuna tıklandı");
        window.location.href = "/viewLibrary";
    });
    
    var addBookButton = document.getElementById("addBook");    
    addBookButton.addEventListener("click", function() {
        console.log("addBook butonuna tıklandı");
        window.location.href = "/addBook";
    });

    var form = document.getElementById("bookForm");
    if(form){
        form.addEventListener("submit", function(event) {
            console.log("Form gönderildi");
            event.preventDefault();
    
            var formData = new FormData(this);
            var jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
    
            // publication_year'ı int'e çevir
            jsonData["publication_year"] = parseInt(jsonData["publication_year"], 10);
    
            console.log("JSON Data:", JSON.stringify(jsonData));
    
            fetch('/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Kitap eklendi:', data);
                window.location.href = "/viewLibrary"; // İşlem sonrası listeyi görüntüle
            })
            .catch(error => {
                console.error('Hata:', error);
            });
        });
    }
    
    // Kitap listesini getirme işlemi
    fetchBookList();
});

function fetchBookList() {
    console.log("fetchBookList fonksiyonu çağrıldı");
    fetch('/books')
    .then(response => response.json())
    .then(data => {
        var bookListDiv = document.getElementById("bookList");
        bookListDiv.innerHTML = ""; // Önceki listeyi temizle

        data.forEach(book => {
            var bookItem = document.createElement("div");
            bookItem.innerHTML = `
                <h3>${book.name}</h3>
                <p>Yazar: ${book.author}</p>
                <p>Yayın Yılı: ${book.publication_year}</p>
                <button data-id="${book.ID}" class="btn btn-primary update-book">Güncelle</button>
                <button data-id="${book.ID}" class="btn btn-danger delete-book">Sil</button>
            `;
            bookListDiv.appendChild(bookItem);
        });

        // Olay delegasyonu ile silme ve güncelleme butonları için dinleyici ekle
        bookListDiv.addEventListener("click", function(event) {
            var target = event.target;
            if (target.classList.contains("delete-book")) {
                console.log("Silme butonuna tıklandı, hedef element:", target);
                var bookId = target.getAttribute("data-id");

                fetch(`/books/${bookId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Kitap silindi:', data);
                    fetchBookList(); // Kitap listesini yeniden yükle
                })
                .catch(error => {
                    console.error('Hata:', error);
                });
            }

            else if (target.classList.contains("update-book")) {
                var bookId = target.getAttribute("data-id");
                console.log("Güncelleme butonuna tıklandı, kitap ID:", bookId);
                window.location.href = "/updateBook?bookId="+bookId;
            }
        });
    })
    .catch(error => {
        console.error('Kitap verisi alinirken hata olustu:', error);
    })
}
