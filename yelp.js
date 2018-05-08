//Student Name: Krishna Chinya
//Student ID: 1001444149

var map,marker=null;
var allMarkers = [];

function initialize () {

}

function initMap() {
        var intialLoc = new google.maps.LatLng(32.75, -97.13);
        map = new google.maps.Map(document.getElementById('map'), {
          center: intialLoc,
          zoom: 16
        });
}

//bounds=37.900000,-122.500000|37.788022,-122.399797&limit=3
//coordinate.latitude
//coordinate.longitude

function sendRequest () {
   resetToDefaults();
   var xhr = new XMLHttpRequest();
   var bounds = map.getBounds();
   var term = encodeURI(document.getElementById("search").value);
   //for storing latitude and longitude
   if(term.length == 0)
   {
       alert("Please enter the search query to proceed");
       return;
   }
   var lat,lng, markercord, markerlng;
   var restuarants, list, hyperlink, snippet_text, image_url, lblname, rating_img_url;
   xhr.open("GET", "proxy.php?term="+ term +"&bounds="+ bounds.f.b +","+ bounds.b.b +"|"+bounds.f.f+
   ","+bounds.b.f+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          lat = json.region.center.latitude;
          lng = json.region.center.longitude;

          restuarants = document.getElementById("restaurants");
          for(var i = 0;i<json.businesses.length;i++)
          {
              list = document.createElement("li");
              image_url = document.createElement("img");
              
              lblname = document.createElement("label");
              hyperlink = document.createElement("a");

              rating_img_url = document.createElement("img")
              snippet_text = document.createElement("p");
             
             //lable with hyperlink created
             lblname = json.businesses[i].name;
             lblname.className = "lblname";
             hyperlink.href = json.businesses[i].url;
             hyperlink.innerHTML = lblname;
             hyperlink.className = "lblname"

             //Images of rest and rating
             image_url.src = json.businesses[i].image_url; 
             image_url.className = "image_url"
             rating_img_url.src = json.businesses[i].rating_img_url;
             rating_img_url.className = "rating_img_url"

             //snippet text
              snippet_text.innerHTML = json.businesses[i].snippet_text;
              snippet_text.className = "snippet_text";
              
              list.id=json.businesses[i].id;

              list.appendChild(image_url);
              list.appendChild(hyperlink);
              list.appendChild(rating_img_url);
              list.appendChild(snippet_text);
              list.className = "rest_list"

              restuarants.appendChild(list);

              //placing the marker
              markercord = {lat: json.businesses[i].location.coordinate.latitude,lng: json.businesses[i].location.coordinate.longitude};
              
              addMarker(markercord, lblname,i);
          }
       }
   };
   xhr.send(null);
}

function addMarker(markercord, lblname,i)
{
    marker = new google.maps.Marker({
    map: map,
    //draggable: true,
    animation: google.maps.Animation.DROP,
    position: markercord,
    title: lblname,
    label: (i+1).toString()
  });

  allMarkers.push(marker);

}

function resetToDefaults()
{
     document.getElementById("restaurants").innerHTML = "";
     for(var i=0;i<allMarkers.length;i++)
     {
     allMarkers[i].setMap(null);
     }
}