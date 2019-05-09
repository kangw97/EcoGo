var map, localStorage, address;

function createMap() {
    var geocoder = new google.maps.Geocoder();
    var longitude = 0;
    var latitude = 0;
    var options = {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 16
    };
    // initial map
    map = new google.maps.Map(document.getElementById("map"), options);
    // converting string address to lat and lng
    geocoder.geocode({ 'address': localStorage.getItem("myAddress")}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
          var pos = {
            lat: latitude,
            lng: longitude
          };
          var myLatLng = { lat: latitude, lng: longitude }
          // reset the center of map
          map.setCenter(pos);
          // place markers
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
          });
        }
      });
}
// automating address
function autoFillAddress(){
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(49.2827, -123.1207),
        new google.maps.LatLng(49.3125, -123.0080));
      
      var input = document.getElementById('adEntry');
      var searchBox = new google.maps.places.SearchBox(input, {
        bounds: defaultBounds
      });
}
// after click we will route you
function random(){
    address = document.getElementById('adEntry').value;
    localStorage.setItem("myAddress", address);
    window.location = "./html/map.html";
}

