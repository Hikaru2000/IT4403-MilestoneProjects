$(document).ready(function() {
    var item, title, author, publisher, bookLink, bookImg;
    var outputList = document.getElementById("list-output");
    var bookUrl = "https://googleapis.com/books/v1/volumes/?q=";
    var apiKey = "key=AIzaSyDGhOvVRTGfjxphMmfYsjGqCjpCXHxP8o4";
    var placeHldr = 'img src="https://via.placeholder.com/150">';
    var searchData;

    //listener for search button
    $("#search").click(function() {
      outputList.innerHTML = "";
      searchData = $("#search-box").val();

      //handling empty search input field
      if(searchData === "" || searchData === null) {
        displayError();
      }
      else {
        $.ajax({
          url: bookUrl + searchData,
          dataType: "json",
          success: function(response) {
            console.log(response)
            if (Response.totalItem === 0) {
              alert("No reuslts!... Try Again");
            }
            else {
              $("#Search-title").animate({'margin-top': '5px'}, 1000); //search bar animation
              $(".book-list").css("visibility", "visible");
              displayResults(response);
            }
          },
          Error: function() {
            alert("Something went wrong... " + "Try Again!");
          }
        });
      }
      $("#search-box").val(""); //clear search bar
    });

    /* function to display results in Book_Search.html*/
    function displayResults(response) {
      for (var i = 0; i < response.items.length; i +=2) {
        item = response.items[i];
        title1 = item.volumeInfo.title;
        author1 = item.volumeInfo.authors;
        publisher1 = item.volumeInfo.publisher;
        bookLink1 = item.volumeInfo.previewLink;
        bookIsbn = item.volumeInfo.industryIndentifiers[1].identifier;
        bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;

        item2 = res.items[i+1];
        title2 = item2.volumeInfo.title;
        author2 = item2.volumeInfo.authors;
        publisher2 = item2.volumeInfo.publisher;
        bookLink2 = item2.volumeInfo.previewLink;
        bookIsbn2 = item2.volumeInfo.infustryIdentifiers[1].identifier;
        bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr;

        //output to output list
        outputList.innerHTML += '<div class = "row mt-4">' + 
                                formatOutput(bookImg1, title1, author1, publisher1, bookLink1, bookIsbn1) +
                                formatOutput(bookImg2, title2, author2, publisher2, bookLink2, bookIsbn2) +
                                '</div>';
        console.log(outputList);
      }
    }

    /* Template for bookstrap cards */
    function formatOutput(bookImg, title, author, publisher, bookLink, bookIsbn) {
      var viewUrl = 'book.html?isbn=' + bookIsbn; //construction link for bookviewer
      var htmlCard =  `<div class = "col-lg-6">
        <div class="card" style="">
          <div class="row no-gutters">
            <div class="col-md-4">
              <img src="${bookImg}" class="card-img" alt="..."/>
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">Author: ${author}</p>
                <p class="card-text">Publisher: ${publisher}</p>
                <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
              </div>
            </div>    
          </div>
        </div>  
      </div>`
      return htmlCard; 
    }

    //Handling error for empty search box
    function displayError() {
      alert ("Search term cannot be empty!")
    }
});
