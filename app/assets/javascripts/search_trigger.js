$(document).on("turbolinks:load", function() {
  var client = algoliasearch("5XRT9YJOYK", "88ef7c02588d792e5241329b66a8dc83");
  var index = client.initIndex("test_RESTAURANT");
  var $input = $("input#search-box");
  $input.keyup(function() {
    index.search($input.val(), {
      hitsPerPage: 3,
      facets: ["food_type"]
    }, searchCallback);
  }).focus();

  function searchCallback(err, content) {
    if (err) {
      console.error(err);
      return;
    }
    var $results = $(".restaurant-list");

    $(".restaurant-list > .row").slice(-3).remove();

    $("span.results-found").html(
      content.nbHits + " results found"
    );

    $("span.in-seconds").html(
      "in " + content.processingTimeMS/1000 + " seconds"
    );

    for (var i = 0; i < content.hits.length; i++){
      $results.prepend(
        '<div class="row restaurant restaurant-id">' +
            '<div class="restaurant-image">' +
              '<img src="' + content.hits[i].image_url + '">' +
            '</div>' +
            '<div class="description">' +
              '<p class="restaurant-title">' + content.hits[i].name + '</p>' +
              '<p class="restaurant-rating">' +
                '<span class="stars-count">' + content.hits[i].stars_count + '</span>' +
                '<span class="stars stars' + Math.round(content.hits[i].stars_count) + '"><span class="stars-inline">&nbsp;</span></span>' +
                '<span class="reviews">(' + content.hits[i].reviews_count + ' reviews)</span>' +
              '</p>' +
              '<p class="restaurant-info">' +
                '<span class="food-type">' + content.hits[i].food_type + '</span> | ' +
                '<span class="location">' + content.hits[i].neighborhood + '</span> | ' +
                '<span class="price-range">' + content.hits[i].price_range + '</span>' +
              '</p>' +
            '</div>' +
          '</div>'
      );
    }

    var $restaurant_type = $("ul#restaurant-type");
    li_elements = "";
    $.each(content.facets.food_type, function(key, value){
      li_elements += '<li class="nav-item">' +
        '<a class="nav-link nav-with-count" href="#">' +
          key +
          '<span class="restaurant-count">' + value + '</span>' +
        '</a>' +
      '</li>'
    });
    $restaurant_type.html(li_elements);
    //console.log(content.facets.food_type.key);
  };
});