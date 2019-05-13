var map, localStorage, address;
//array to store all the addresses.
var myAddress = ["5089 Dominion St, Burnaby, BC V5G 1C8", "3700 Wilingdon Ave, Burnaby BC V5G 3H2", "4670 Assembly Way, Burnaby, BC V5H 0H3","4500 Still Creek Dr, Burnaby, BC V5C 0E5"];
//the number of addresses in array "myAddress" 
var length = myAddress.length;
//initialize google map API
function initMap() {

    var geocoder = new google.maps.Geocoder();
    var longitude = 0;
    var latitude = 0;
    var options = {
        center: { lat: 49.2827, lng: -123.1207 },
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true
    };
    map = new google.maps.Map(document.getElementById("map"), options);
    // converting string address to lat and lng
 
   
    geocoder.geocode({ 'address': myAddress[0] }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
         
            var myLatLng = { lat: latitude, lng: longitude }
          
            // place markers
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
            });
        }
    });
}
