// default map, localstorage and the user's starting address
var map, localStorage, startingAddress;

// firebase root
var dbRef;

var geocoder;
// random ints for randomizing the trip
var randomRest1, randomRest2, randomRet, randomAct;
// 3 2D arrays that store restaurant, retailer and activity info
var retArr = [[], [], [], []], 
  actArr = [[], [], [], []], 
    restArr = [[], [], [], []];
// 2d array to store the info of the 4 places of the trip
var myTrip;

// array for storing markers
var markers = [];

// createMap function with the marker of starting address
function createMap() {
    // rest the 3 2d arrays in randomRoute page for randomizingRoute function
    restArr = JSON.parse(localStorage.getItem("restArray"));
    retArr = JSON.parse(localStorage.getItem("retArray"));
    actArr = JSON.parse(localStorage.getItem("actArray"));  
    // generating the trip user interface by call tripList function
    tripList();
    geocoder = new google.maps.Geocoder();
    var options = {
        center: {lat: 49.2827, lng: -123.1207},
        zoom: 11,
        disableDefaultUI: true,
        zoomControl: true
    };
    // initial map
    map = new google.maps.Map(document.getElementById("map"), options);
    showPinPoints(localStorage.getItem("myAddress"));
    for(var i = 0; i < 4; i++) {
      showPinPoints(myTrip[1][i]);
    }
}
// converting string address to lat and lng, show markers on map
function showPinPoints(address) {
  // converting string address to lat and lng
  geocoder.geocode({'address': address}, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      // for marker
      var initialLatLng = {
        lat: latitude, 
        lng: longitude 
      }
      // place markers
      var marker = new google.maps.Marker({
        position: initialLatLng,
        map: map
      });
      markers.push(marker);
    }
  });
}

// listing the 4 random activities using DOM
function tripList(){
  randomizingRoute();
  var wholeTrip = document.getElementById("trip");
  wholeTrip.innerHTML = "this is a test";
}
// initializing 2d arrays function
function initialArray(type) {
  // database path
  dbref = firebase.database().ref(type);
  dbref.on('value', function (snap) {
      var info = snap.val();
      var keys = Object.keys(info);
      // for loop to retrive data from firebase and store in the 3 2D array
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var name = info[k].Name;
        var street = info[k].Street;
        var city = info[k].City;
        var state = info[k].State;
        var type = info[k].Category;
        var des = info[k].Description;
        if (type == "Restaurant") {
          restArr[0][i] = name;
          restArr[1][i] = street + ", " + city + ", " + state;
          restArr[2][i] = type;
          restArr[3][i] = des; 
        } else if (type == "Retailer") {
          retArr[0][i] = name;
          retArr[1][i] = street + ", " + city + ", " + state;
          retArr[2][i] = type;
          retArr[3][i] = des;
        } else {
          actArr[0][i] = name;
          actArr[1][i] = street + ", " + city + ", " + state;
          actArr[2][i] = type;
          actArr[3][i] = des;
        }
      }
  });
}
// random the locations by using generating random integer numbers as index to the 3d arrays 
function randomizingRoute(){
  randomRest1 = parseInt((Math.random() * restArr[0].length), 10);
  randomRest2 = parseInt((Math.random() * restArr[0].length), 10);
  // different restaurant for lunch and dinner
  while(randomRest1 == randomRest2) {
    randomRest2 = parseInt((Math.random() * restArr[0].length), 10);
  }
  randomRet = parseInt((Math.random() * retArr[0].length), 10);
  randomAct = parseInt((Math.random() * actArr[0].length), 10);
  // reset random trip array to empty
  myTrip = [[], [], [], []];

  for(var i = 0; i < 4; i++)  {
    myTrip[i][0] = actArr[i][randomAct];
    myTrip[i][1] = restArr[i][randomRest1];
    myTrip[i][2] = retArr[i][randomRet];
    myTrip[i][3] = restArr[i][randomRest2];
  }
}
// reroute function
function reroute(){
  // rerandomizing
  randomizingRoute();
  
  var options = {
    center: {lat: 49.2827, lng: -123.1207},
    zoom: 10,
    disableDefaultUI: true,
    zoomControl: true
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  showPinPoints(localStorage.getItem("myAddress"));
  for(var i = 0; i < 4; i++) {
    showPinPoints(myTrip[1][i]);
  }
}

// let's go function
function go() {

}

// automating address and initializing 2d arrays store then in localstorage
function autoFillAddress(){
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(49.2827, -123.1207),
        new google.maps.LatLng(49.3125, -123.0080)
    );
    var input = document.getElementById('adEntry');
    var searchBox = new google.maps.places.SearchBox(input, {
      bounds: defaultBounds
    });
    // initialzing 3 2D arrays that store restaurant, retailer and activity info
    initialArray("Restaurant");
    initialArray("Retailer");
    initialArray("Activity");
}
// after click we will route you
function random(){
  // check if user entry is empty
  var fill = document.getElementById('adEntry').value;
    if(fill == "") {
      alert("Enter Your Location");
    } else {
      startingAddress = document.getElementById('adEntry').value;
      // local store the variables that will be used in randomRoute page
      localStorage.setItem("myAddress", startingAddress);
      localStorage.setItem("restArray",JSON.stringify(restArr));
      localStorage.setItem("retArray",JSON.stringify(retArr));
      localStorage.setItem("actArray",JSON.stringify(actArr));
      window.location = "./html/randomRoute.html";
    }
}