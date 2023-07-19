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
    $(document).on("mouseenter", ".books img", function () {
        $(this).css("opacity", "0.7");
    });

    $(document).on("mouseleave", ".books img", function () {
        $(this).css("opacity", "1");
    });

	$(function(){
		$("#grid_View-btn").click(function(){
			$("#.books").css("width","34%");
		        $("#results").attr("data-layout","Grid");
	    	});
	   	$("#list_View-btn").click(function(){
		        $(".book").css("width","99%");
			$("#.book").css("float","left");
		        $("#results").attr("data-layout","List");
	    	});
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

	$("#pagination").on('click',function (event) {
	 	var x = event.target.textContent;
	 	var pages= document.getElementsByClassName("page");
	 	/*var url=service_point+$("#search_bar").val()+"&startIndex="+(x-1)*10;*/
	 	searchBooks(url);
	});

        // Render books
        $.getJSON(url, function (json) {
          	$("#results").html()
              	var booksMustc =' '+'<div class="book"><img class="bookThumb" id="{{id}}" src="{{volumeInfo.imageLinks.smallThumbnail}}"/>' + '<br><h3>{{volumeInfo.title}}</h3></div>';
              	for(i in json.items){
                    $("#results").append(Mustache.render(booksMustc, json.items[i]));
                };
                $(".bookThumb").click(function(){
                    showDetails($(this).attr("id"));
                });
          });

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
      $("#details").html(newInfo);
    
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
            var booksMustc =' '+'<div class="book"><img class="bookThumb" id="{{id}}" src="{{volumeInfo.imageLinks.smallThumbnail}}"/>' + '<br><h3>{{volumeInfo.title}} </h3></div>';
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
      			$("#details").html("");
      			var newInfo=Mustache.render(BookinfoTemp,json);
      			$("#details").html(newInfo);
      		});
      	}

	// Add hover effect to book images
    	$(document).on("mouseenter", ".book img", function () {
        	$(this).css("opacity", "0.7");
    	});

    	$(document).on("mouseleave", ".book img", function () {
        	$(this).css("opacity", "1");
    	});
}


