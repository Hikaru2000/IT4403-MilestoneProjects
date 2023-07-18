var searchTerms = "";
var currentPage = 1;
var userId = "101017463850449745679";
var apiURL = "https://www.googleapis.com/books/v1/users/";

/* Main Function */
$(document).ready(function () {
    $("#searchbutton").click(function () {
        searchTerms = $("#searchbox").val();
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

    $("#list_View-btn").click(function () {
    	$("#books").addClass("list-view");
	$("#books").removeClass("grid-view");
	searchBooks();
    });

    $("#grid_View-btn").click(function () {
    	$("#books").addClass("grid-view");
        $("#books").removeClass("list-view");
        searchBooks();
    });

    fetchBookshelf();
});
/* End Main */

/* Function to Search Books and change pages */
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
        $.getJSON(url, function (json) {
          	$("#results").html()
              	var booksMustc =' '+'<img class="bookThumb" id="{{id}}" src="{{volumeInfo.imageLinks.smallThumbnail}}"/>';
              	for(i in json.items){
                    $("#results").append(Mustache.render(booksMustc, json.items[i]));
                };
                $(".bookThumb").click(function(){
                    showDetails($(this).attr("id"));
                });
          });

        /*
        $.each(data.items, function (i, item) {
            var book = item.volumeInfo;
            var bookHtml = "<div class='book'><a href='#' onclick='showDetails(\"" + item.id + "\")'>";

            if (book.imageLinks && book.imageLinks.thumbnail) {
                bookHtml += "<img src='" + book.imageLinks.thumbnail + "' alt='Book Cover'>";
            }

            bookHtml += "<div class='book-title'>" + book.title + "</div></a></div>";

            $("#books").append(bookHtml);
        });*/
    });
}

/* Function to change pagination pages */
function changePage(page) {
    currentPage = page;
    searchBooks();
}


/* Show Book Details */
function showDetails(bookId) {
    var url = "https://www.googleapis.com/books/v1/volumes/" + bookId;

    var BookinfoTemp= '<img width="200" height="200" src="{{volumeInfo.imageLinks.smallThumbnail}}/>"'+'<br><h1> Title: {{volumeInfo.title}}'+'<br>Subtitle: {{volumeInfo.subtitle}}'+'<br>Authors: {{volumeInfo.authors}}'+'<br></h1><p>Publisher: {{volumeInfo.publisher}}'
		+'<br>Published date: {{volumeInfo.publishedDate}}'+'<br>Number of pages: {{volumeInfo.pageCount}} '+'<br></p>Description: {{volumeInfo.description}}'+'<br>Categories: {{volumeInfo.categories}}'+'<br>Average rating: {{volumeInfo.averageRating}}'
		+'<br>Number of reviews: {{volumeInfo.ratingsCount}}'+'<br> Maturity Rating: {{volumeInfo.maturityRating}}'+'<br>Language: {{volumeInfo.language}} '+'<br>Sale Info: {{saleInfo.saleability}}'+'<br></p>';
      $.getJSON(url, function(json){
      $("#details").html("");
      var newInfo=Mustache.render(BookinfoTemp,json);
      $("#details").html(detailsHtml);
    
        // Hide search results and show book details
        $("#results").hide();
        $("#bookDetails").show();
    });
}

/* Show Search Results - Hide Book Details */
function showSearchResults() {
    // Show search results and hide book details
    $("#bookDetails").hide();
    $("#results").show();
}



/* Bookshelf JS */
function fetchBookshelf() {
      	var url = apiURL + userId + "/bookshelves/1001/volumes";
	
	$.getJSON(url, function (data) {
        	$("#bookshelf-books").empty();
            
                if (data.totalItems === 0) {
                	$("#bookshelf-books").text("No books found in the bookshelf.");
                        return;
                }
	});
    
        $("#bookshelf-books").html();
            var booksMustc =' '+'<img class="bookThumb" id="{{id}}" src="{{volumeInfo.imageLinks.smallThumbnail}}"/>';
            $.getJSON('https://www.googleapis.com/books/v1/users/101017463850449745679/bookshelves/1001/volumes', function (json){
	        for(i in json.items){
	            $("#bookshelf-books").append(Mustache.render(booksMustc, json.items[i]));
		};
	        $(".bookThumb").click(function(){
	            showDetails($(this).attr("id"));
	        });
	    });

	function getBookInfo(id){
      		var url = 'https://www.googleapis.com/books/v1/volumes/' + id;
      		var BookinfoTemp= '<img width="200" height="200" src="{{volumeInfo.imageLinks.smallThumbnail}}/>"'+'<br><h1> Title: {{volumeInfo.title}}'+'<br>Subtitle: {{volumeInfo.subtitle}}'+'<br>Authors: {{volumeInfo.authors}}'+'<br></h1><p>Publisher: {{volumeInfo.publisher}}'
		+'<br>Published date: {{volumeInfo.publishedDate}}'+'<br>Number of pages: {{volumeInfo.pageCount}} '+'<br></p>Description: "{{volumeInfo.description}}"'+'<br>Categories: {{volumeInfo.categories}}'+'<br>Average rating: {{volumeInfo.averageRating}}'
		+'<br>Number of reviews: {{volumeInfo.ratingsCount}}'+'<br> Maturity Rating: {{volumeInfo.maturityRating}}'+'<br>Language: {{volumeInfo.language}} '+'<br>Sale Info: {{saleInfo.saleability}}'+'<br></p>';
      		$.getJSON(url, function(json){
      			$("#info1").html("");
      			var newInfo=Mustache.render(BookinfoTemp,json);
      			$("#info1").html(newInfo);
      		});
      	}		
}


