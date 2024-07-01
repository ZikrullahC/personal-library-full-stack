document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded olayı tetiklendi");

    var viewLibraryButton = document.getElementById("viewLibrary");
    if (viewLibraryButton) {
        console.log("viewLibrary butonu bulundu");
        viewLibraryButton.addEventListener("click", function() {
            console.log("viewLibrary butonuna tıklandı");
            window.location.href = "/viewLibrary";
        });
    } else {
        console.error("viewLibrary butonu bulunamadı");
    }

    var addBookButton = document.getElementById("addBook");
    if (addBookButton) {
        console.log("addBook butonu bulundu");
        addBookButton.addEventListener("click", function() {
            console.log("addBook butonuna tıklandı");
            window.location.href = "/addBook";
        });
    } else {
        console.error("addBook butonu bulunamadı");
    }

    var form = document.getElementById("bookForm");
    if (form) {
        console.log("Form bulundu ve işleme hazır");

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
    } else {
        console.error("Form bulunamadı");
    }

    // Kitap listesini getirme işlemi
    fetchBookList();

    if (window.location.pathname === "/updateBook") {
        var urlParams = new URLSearchParams(window.location.search);
        var bookId = urlParams.get('id');

        if (bookId) {
            console.log("Güncellenecek kitap ID:", bookId);
            fetch('/books/' + bookId)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Kitap bilgileri:', data);
                    document.getElementById('updateId').value = data.ID;
                    document.getElementById('updateTitle').value = data.name;
                    document.getElementById('updateAuthor').value = data.author;
                    document.getElementById('updatePublicationYear').value = data.publication_year;
                })
                .catch(error => console.error('Kitap bilgileri alınırken hata:', error));
        } else {
            console.error("Kitap ID'si bulunamadı");
            alert("Kitap ID'si bulunamadı. Lütfen kitap listesine dönün ve tekrar deneyin.");
        }

        var updateForm = document.getElementById("updateForm");
        if (updateForm) {
            updateForm.addEventListener("submit", function(event) {
                event.preventDefault();
                var id = document.getElementById("updateId").value;
                
                if (!id) {
                    console.error("Kitap ID'si bulunamadı");
                    alert("Kitap ID'si bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.");
                    return;
                }

                var formData = new FormData(this);
                var jsonData = {};
                formData.forEach((value, key) => {
                    if (value) { // Sadece değeri olan alanları gönder
                        jsonData[key] = value;
                    }
                });
                if (jsonData.publication_year) {
                    jsonData.publication_year = parseInt(jsonData.publication_year, 10);
                }

                console.log("Güncellenecek kitap ID:", id);
                console.log("Gönderilecek veri:", JSON.stringify(jsonData));

                fetch('/books/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Kitap güncellendi:', data);
                    window.location.href = "/viewLibrary";
                })
                .catch(error => {
                    console.error('Güncelleme hatası:', error);
                    alert('Kitap güncellenirken bir hata oluştu: ' + error.message);
                });
            });
        }
    }
});

function fetchBookList() {
    console.log("fetchBookList fonksiyonu çağrıldı");
    fetch('/books')
    .then(response => response.json())
    .then(data => {
        console.log('Kitaplar:', data);
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
                var bookId = target.getAttribute("data-id");
                console.log("Bulunan kitap ID:", bookId);
                if (!bookId) {
                    console.error("Kitap ID'si bulunamadı");
                    return;
                }
                console.log("Silme butonuna tıklandı, kitap ID:", bookId);
                console.log("Fetch URL: /books/" + bookId);

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

            if (target.classList.contains("update-book")) {
                var bookId = target.getAttribute("data-id");
                console.log("Güncelleme butonuna tıklandı, kitap ID:", bookId);
                window.location.href = `/updateBook?id=${bookId}`;
            }
        });
    })
    .catch(error => {
        console.error('Kitap verisi alinirken hata olustu:', error);
    });
}
