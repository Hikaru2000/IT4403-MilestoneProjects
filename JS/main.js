var searchTerms = "";
var currentPage = 1;
var userId = "101017463850449745679";
var apiURL = "https://www.googleapis.com/books/v1/users/";

function searchBooks() {
    var url = "https://www.googleapis.com/books/v1/volumes?q=" + searchTerms + "&startIndex=" + ((currentPage - 1) * 10) + "&maxResults=10";

    $.getJSON(url, function (data) {
        $("#books").empty();

        if (data.totalItems === 0) {
          $("#books").text("No results found.");
          $("#pagination").empty();
          return;
        }

        var totalPages = Math.ceil(data.totalItems / 10);
        var displayPages = 5;
        var startPage = currentPage - Math.floor(displayPages / 2);
        startPage = Math.max(startPage, 1);
        var endPage = startPage + displayPages - 1;
        endPage = Math.min(endPage, totalPages);

        // Render pagination
        var paginationHtml = "<div class='pagination'>";
        if (startPage !== 1) {
          paginationHtml += "<a href='#' onclick='changePage(" + (startPage - 1) + ")'>Previous</a>";
        }
        
        for (var i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += "<a class='active' href='#'>" + i + "</a>";
            } else {
                paginationHtml += "<a href='#' onclick='changePage(" + i + ")'>" + i + "</a>";
            }
        }
        
        if (endPage !== totalPages) {
          paginationHtml += "<a href='#' onclick='changePage(" + (endPage + 1) + ")'>Next</a>";
        }
        paginationHtml += "</div>";
        $("#pagination").html(paginationHtml);

        // Render books
        $.each(data.items, function (i, item) {
            var book = item.volumeInfo;
            var bookHtml = "<div class='book'><a href='#' onclick='showDetails(\"" + item.id + "\")'>";

            if (book.imageLinks && book.imageLinks.thumbnail) {
                bookHtml += "<img src='" + book.imageLinks.thumbnail + "' alt='Book Cover'>";
            }

            bookHtml += "<div class='book-title'>" + book.title + "</div></a></div>";

            $("#books").append(bookHtml);
        });
    });
}

function changePage(page) {
    currentPage = page;
    searchBooks();
}


function showDetails(bookId) {
    var url = "https://www.googleapis.com/books/v1/volumes/" + bookId;

    $.getJSON(url, function (data) {
        var book = data.volumeInfo;
    
        var detailsHtml = "<h3>" + book.title + "</h3>";
    
        if (book.authors) {
            detailsHtml += "<p><strong>Authors:</strong> " + book.authors.join(", ") + "</p>";
        }
    
        if (book.description) {
            detailsHtml += "<p><strong>Description:</strong> " + book.description + "</p>";
        }
    
        if (book.categories) {
            detailsHtml += "<p><strong>Categories:</strong> " + book.categories.join(", ") + "</p>";
        }
            
        if (book.publisher) {
            detailsHtml += "<p><strong>Publisher:</strong> " + book.publisher + "</p>";
        }
    
        if (book.publishedDate) {
            detailsHtml += "<p><strong>Published Date:</strong> " + book.publishedDate + "</p>";
        }
    
        if (book.pageCount) {
          detailsHtml += "<p><strong>Page Count:</strong> " + book.pageCount + "</p>";
        }
    
        if (book.imageLinks && book.imageLinks.thumbnail) {
            detailsHtml += "<img src='" + book.imageLinks.thumbnail + "' alt='Book Cover'>";
        }
    
        $("#details").html(detailsHtml);
    
        // Hide search results and show book details
        $("#results").hide();
        $("#bookDetails").show();
    });
}

function showSearchResults() {
    // Show search results and hide book details
    $("#bookDetails").hide();
    $("#results").show();
}

function fetchBookshelf() {
    var url = apiURL + userId + "/bookshelves/1001/volumes";

    $.getJSON(url, function (data) {
        $("#bookshelf-books").empty();

        if (data.totalItems === 0) {
            $("#bookshelf-books").text("No books found in the bookshelf.");
            return;
        }

        $.each(data.items, function (i, item) {
            var book = item.volumeInfo;
            var bookHtml = "<div class='book'><a href='#' onclick='showDetails(\"" + item.id + "\")'>";

            if (book.imageLinks && book.imageLinks.thumbnail) {
                bookHtml += "<img src='" + book.imageLinks.thumbnail + "' alt='Book Cover'>";
            }

            bookHtml += "<div class='book-title'>" + book.title + "</div></a></div>";

            $("#bookshelf-books").append(bookHtml);
        });
    });
}

$(document).ready(function () {
    $("#searchbutton").click(function () {
        searchTerms = $("#search").val();
        currentPage = 1;
        searchBooks();
    });

    $("#backBtn").click(function () {
        showSearchResults();
    });

    // Add hover effect to book images
    $(document).on("mouseenter", ".book img", function () {
        $(this).css("opacity", "0.7");
    });

    $(document).on("mouseleave", ".book img", function () {
        $(this).css("opacity", "1");
    });

    fetchBookshelf();
});
