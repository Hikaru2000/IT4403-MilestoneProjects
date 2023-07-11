$(document).ready(function(){
    var service_point="https://www.googleapis.com/books/v1/volumes/?q=";
    $("#search_button").click(function(){
        var url=service_point+$("#search_bar").val();
        bookSearch(url);
        $("#pages").html("");
        for (i=1;i<=5;i++){
            $("#pages").append("<a class='page' href='#'>"+i+"</a>");
        }
    });
    $("#pages").on('click',function (event) {
        var x = event.target.textContent;
        var pages= document.getElementsByClassName("page");
        var url=service_point+$("#search_bar").val()+"&startIndex="+(x-1)*10;
        bookSearch(url);
    });
});
 
function bookSearch(serviceURL){
    $.getJSON(serviceURL, function (json){
        $("#searchResults").html("<h1>Search Results:</h1><br>")
        for(i in json.items){
            $("#searchResults").append("<img class='bookThumb' id='"+json.items[i].id+"' src='"+json.items[i].volumeInfo.imageLinks.smallThumbnail+"'/>");
        };
        $(".bookThumb").click(function(){
            getBookInfo($(this).attr("id"));
        });
    });
    function getBookInfo(id){
        var url = 'https://www.googleapis.com/books/v1/volumes/' + id
        $.getJSON(url, function(json){
            $("#info1").html("<h1> Title: "+json.volumeInfo.title+"<br>Subtitle: "+json.volumeInfo.subtitle+"<br>Authors: "+json.volumeInfo.authors+"<br></h1><p>Publisher: "
    		      +json.volumeInfo.publisher+"<br>Published date: "+json.volumeInfo.publishedDate+"<br>Number of pages: "+json.volumeInfo.pageCount+"<br></p>"+json.volumeInfo.description+"<br>Categories: "+json.volumeInfo.categories+"<br>Average rating: "
    		      +json.volumeInfo.averageRating+"<br>Number of reviews: "+json.volumeInfo.ratingsCount+"<br> Maturity Rating: "+json.volumeInfo.maturityRating+"<br>Language: "+json.volumeInfo.language+"<br>"+json.saleInfo.saleability+"<br></p>"
    		    );
    		    $("#thumbnail").attr('src',json.volumeInfo.imageLinks.thumbnail);
    		    $("#prelink").attr('href', json.volumeInfo.previewLink);
    		    $("#infolink").attr('href', json.volumeInfo.infoLink);
        });
    }
}

