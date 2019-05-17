// default map, localstorage and the user's starting address
var map, localStorage, startingAddress;
// firebase root
var dbRef;
// marker with blue color to show starting address
var markerBlue = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
// marker with red color to show destinations
var markerRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
// geoCoder variable to change address to lat and lng
var geocoder;
// random ints for randomizing the trip
var randomRest1, randomRest2, randomRet, randomAct;
// 3 2D arrays that store restaurant, retailer and activity info
var retArr = [[], [], [], []], 
  actArr = [[], [], [], []], 
    restArr = [[], [], [], []];
// 2d array to store the info of the 4 places of the trip
var myTrip;
// whole trip, 5 address
var wholeTrip = [];
// keep track of which route the user is on 
var trackRoute = 0;
// array stores the way points
var waypts = [];
// divs for holding trip details
var mainDiv, trip1, trip2, trip3, trip4;
// divs for holding marker images
var markerImgDiv1, markerImgDiv2, markerImgDiv3, markerImgDiv4;
// divs for holding more info buttons
var buttonDiv1, buttonDiv2, buttonDiv3, buttonDiv4;
// buttons for more info
var button1, button2, button3, button4;
// description for each trip
var descriptions;
// for getting direction service api
var directionsService;
// for show directions on map service api
var directionsDisplay;

var displayOnce = 0;
// createMap function with the marker of starting address
function createMap() {
    // rest the 3 2d arrays in randomRoute page for randomizingRoute function
    restArr = JSON.parse(localStorage.getItem("restArray"));
    retArr = JSON.parse(localStorage.getItem("retArray"));
    actArr = JSON.parse(localStorage.getItem("actArray"));  
    geocoder = new google.maps.Geocoder();   
    // generating the trip user interface by call tripList function
    randomizingRoute();
    // call set waypoints function
    setUpWayPoints();
    // call initial map and show route function
    showRoute();
    // show the trip detail using DOM
    tripList();
}

// initial the map and show the route of entire trip
function showRoute() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: { lat: 49.2827, lng: -123.1207 },//downtown vancouver
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'greedy'
  });
  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}

// function to display route and get the distance of two points
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    //convert origin and destinations into lat and lng
    origin: localStorage.getItem("myAddress"),
    destination: myTrip[1][3],
    waypoints: waypts,
    optimizeWaypoints: false,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          if(!displayOnce) {
            descriptions[i].innerHTML += route.legs[i].distance.text;
          }
        }
    } else {
        window.alert('Directions request failed due to ' + status);
    }
    displayOnce = 1;
  });
}

// set up the destination between the starting location and the last destination
function setUpWayPoints(){
  for(var i = 0; i < 3; i++){
    waypts.push({
      location: myTrip[1][i],
      stopover: true
    });
  }
}

// listing the 4 random activities using DOM
function tripList(){
  // creating divs to hold the trip list
  mainDiv = document.createElement("div");
  trip1 = document.createElement("div");
  trip2 = document.createElement("div");
  trip3 = document.createElement("div");
  trip4 = document.createElement("div");

  // appending divs into other divs
  document.body.appendChild(mainDiv);
  mainDiv.appendChild(trip1);
  mainDiv.appendChild(trip2);
  mainDiv.appendChild(trip3);
  mainDiv.appendChild(trip4);

  // creating destination marker divs to hold images
  markerImgDiv1 = document.createElement("div");
  markerImgDiv2 = document.createElement("div");
  markerImgDiv3 = document.createElement("div");
  markerImgDiv4 = document.createElement("div");
  var markerImg1 = document.createElement("img");
  var markerImg2 = document.createElement("img");
  var markerImg3 = document.createElement("img");
  var markerImg4 = document.createElement("img");
  markerImg1.src = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  markerImg1.alt = "Red Marker Image";
  markerImg2.src = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  markerImg2.alt = "Blue Marker Image";
  markerImg3.src = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  markerImg3.alt = "Orange Marker Image";
  markerImg4.src = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
  markerImg4.alt = "Purple Marker Image";

  // appending images
  trip1.appendChild(markerImgDiv1);
  trip2.appendChild(markerImgDiv2);
  trip3.appendChild(markerImgDiv3);
  trip4.appendChild(markerImgDiv4);
  markerImgDiv1.appendChild(markerImg1);
  markerImgDiv2.appendChild(markerImg2);
  markerImgDiv3.appendChild(markerImg3);
  markerImgDiv4.appendChild(markerImg4);

  // creating destination descriptions divs
  var destDiv1 = document.createElement("div");
  var destDiv2 = document.createElement("div");
  var destDiv3 = document.createElement("div");
  var destDiv4 = document.createElement("div");

  // appending destDivs
  trip1.appendChild(destDiv1);
  trip2.appendChild(destDiv2);
  trip3.appendChild(destDiv3);
  trip4.appendChild(destDiv4);


  // creating buttons for more info
  buttonDiv1 = document.createElement("div");
  buttonDiv2 = document.createElement("div");
  buttonDiv3 = document.createElement("div");
  buttonDiv4 = document.createElement("div");
  button1 = document.createElement("button");
  button2 = document.createElement("button");
  button3 = document.createElement("button");
  button4 = document.createElement("button");

  // appending button divs
  trip1.appendChild(buttonDiv1);
  trip2.appendChild(buttonDiv2);
  trip3.appendChild(buttonDiv3);
  trip4.appendChild(buttonDiv4);
  buttonDiv1.appendChild(button1);
  buttonDiv2.appendChild(button2);
  buttonDiv3.appendChild(button3);
  buttonDiv4.appendChild(button4);

  // generalize trips with class
  trip1.setAttribute("class", "trip");
  trip2.setAttribute("class", "trip");
  trip3.setAttribute("class", "trip");
  trip4.setAttribute("class", "trip");
  var trips = document.getElementsByClassName("trip");

  // generilizing trips with class
  markerImgDiv1.setAttribute("class", "marker");
  markerImgDiv2.setAttribute("class", "marker");
  markerImgDiv3.setAttribute("class", "marker");
  markerImgDiv4.setAttribute("class", "marker");
  var markers = document.getElementsByClassName("marker");

  // generilzing trip descriptions with class
  destDiv1.setAttribute("class", "description");
  destDiv2.setAttribute("class", "description");
  destDiv3.setAttribute("class", "description");
  destDiv4.setAttribute("class", "description");
  descriptions = document.getElementsByClassName("description");

  // generilizing button divs with class
  buttonDiv1.setAttribute("class", "buttonD");
  buttonDiv2.setAttribute("class", "buttonD");
  buttonDiv3.setAttribute("class", "buttonD");
  buttonDiv4.setAttribute("class", "buttonD");
  var buttonDs = document.getElementsByClassName("buttonD");

  // generilizing button with class
  button1.setAttribute("class", "button");
  button2.setAttribute("class", "button");
  button3.setAttribute("class", "button");
  button4.setAttribute("class", "button");
  var buttons = document.getElementsByClassName("button");

  // Css for mainDiv
  mainDiv.style.width = "90%";
  mainDiv.style.margin = "90px auto";

  for(var i = 0; i < 4; i++) {
    // css for 4 trip divs
    trips[i].style.width = "100%";
    trips[i].style.height = "100px";
    trips[i].style.marginTop = "5px";
    trips[i].style.paddingBottom = "10px";
    trips[i].style.borderBottom = "0.5px solid black";
    trips[i].style.fontFamily = "sans-serif";

    // css for 4 marker divs
    markers[i].style.width = "32px";
    markers[i].style.height = "32px"
    markers[i].style.margin = "30px 0 0 15px";
    markers[i].style.position = "absolute";

    // css for 4 desination description divs
    descriptions[i].style.margin = "5px 0 0 80px";
    descriptions[i].style.width = "45%";
    descriptions[i].style.height = "90px";
    descriptions[i].style.position = "absolute";
    descriptions[i].innerHTML = "<b>" + myTrip[0][i] + "</b><br><br>";
    descriptions[i].innerHTML += myTrip[2][i] + "<br><br>";

    // css for 4 button divs 
    buttonDs[i].style.width = "50px";
    buttonDs[i].style.height = "50px";
    buttonDs[i].style.margin = "25px 0 0 75%";

    // css for 4 buttons
    buttons[i].style.width = "50px";
    buttons[i].style.height = "50px";
    buttons[i].style.margin = "25px 0 0 75%";
    buttons[i].style.border = "2px solid black";
    buttons[i].style.borderRadius = "50%";
    buttons[i].innerHTML = "i";
    buttons[i].style.fontSize = "20pt";
    buttons[i].style.color = "black";
    buttons[i].style.background = "transparent";
    buttons[i].id = i;
    showMoreInfo(buttons[i]);
  }
}
// show more info after clicking i button
function showMoreInfo(btnMoreInfo){
  btnMoreInfo.addEventListener("click", function(){
    var latitude, longitude;
    // converting address into lat and lng for recentering the map
    geocoder.geocode({ "address": myTrip[1][btnMoreInfo.id]}, function (results, status) {
      if ((status == google.maps.GeocoderStatus.OK)) {
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();
        var myLatLng = {
          lat: latitude, lng: longitude
        }
        // reinitializing the map to the location associated with the info button
        map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          disableDefaultUI: true,
          zoom: 15,
          zoomControl: true,
          gestureHandling: 'greedy'
        });
        // place the marker
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon:{
            url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          },
          animation: google.maps.Animation.DROP
        });
      }
    });
      // reCssing using dom after more info button is clicked
      trip1.style.display = "none";
      trip2.style.display = "none";
      trip3.style.display = "none";
      trip4.style.display = "none";
      document.getElementById("reroute").style.display = "none";
      document.getElementById("go").style.display = "none";
      // creating elements using dom
      var back = document.createElement("button");
      var desMoreInfo = document.createElement("div");
      // css for bakc button 
      back.innerHTML = "X";
      back.style.fontSize = "12pt";
      back.style.textAlign = "center";
      back.style.position = "absolute";
      back.style.width = "25px";
      back.style.height = "25px";
      back.style.margin = "-50px 0 0 300px";
      back.style.border = "1px solid black";
      // css for description in more info
      desMoreInfo.style.width = "300px";
      desMoreInfo.style.height = "200px";
      desMoreInfo.style.margin = "60px auto";
      desMoreInfo.innerHTML = myTrip[3][btnMoreInfo.id] + "<br><br>";
      desMoreInfo.innerHTML += myTrip[1][btnMoreInfo.id];
      
      //css for mainDive
      mainDiv.style.marginTop = "0px";

      // appending elements into mainDiv
      mainDiv.appendChild(back);
      mainDiv.appendChild(desMoreInfo);

      // onClickFunction for back button
      back.addEventListener("click", function () {
      showRoute();
      back.style.display = "none";
      desMoreInfo.style.display = "none";
      trip1.style.display = "block";
      trip2.style.display = "block";
      trip3.style.display = "block";
      trip4.style.display = "block";
      mainDiv.style.marginTop = "90px";
      document.getElementById("reroute").style.display = "block";
      document.getElementById("go").style.display = "block";
    });
  });
}
// after clicking reroute change the contents in the description list
function newLocations() {
  for(var i = 0; i < 4; i++) {
    descriptions[i].innerHTML = "<b>" + myTrip[0][i] + "</b><br><br>";
    descriptions[i].innerHTML += myTrip[2][i] + "<br><br>";
  }
}
// reroute function
function reroute(){
  displayOnce = 0;
  // empty waypts
  waypts = [];
  randomizingRoute();
  setUpWayPoints();
  showRoute();
  newLocations();
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
// let's go function
function go() {
  wholeTrip.push(localStorage.getItem("myAddress"));
  for(var i = 0; i < 4; i++){
    wholeTrip.push(myTrip[1][i]);
  }
  // css for making some buttons disapear and add more details of the trip
  trip1.style.display = "none";
  trip2.style.display = "none";
  trip3.style.display = "none";
  trip4.style.display = "none";
  document.getElementById("reroute").style.display = "none";
  document.getElementById("go").style.display = "none";
  var nextButtonDiv = document.createElement("div");
  var nextButton = document.createElement("button");
  mainDiv.appendChild(nextButtonDiv);
  nextButtonDiv.appendChild(nextButton);
  trip1.style.borderBottom = "0px";
  nextButtonDiv.style.width = "85px";
  nextButtonDiv.style.height = "50px";
  nextButtonDiv.style.margin = "40px 0 0 250px";
  nextButton.style.width = "75px";
  nextButton.style.height = "40px";
  nextButton.innerHTML = "Next";
  nextButton.style.textAlign = "center";
  descriptions[0].innerHTML += "<br><br>" + myTrip[1][0];
  markerImgDiv1.style.margin = "55px 0 0 5px";
  button1.style.marginTop = "45px";
  // zoom in map
  startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
  nextButton.addEventListener("click", function(){
    startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
    if(trackRoute == 4){
      nextButton.style.display = "none";
      var doneButton = document.createElement("button");
      doneButton.style.width = "75px";
      doneButton.style.height = "40px";
      doneButton.innerHTML = "Done";
      doneButton.style.textAlign = "center";
      nextButtonDiv.appendChild(doneButton);
      doneButton.addEventListener("click", function(){
        window.location = "http://www.bcit.ca";
      });
    }
  });
}
// show the route of two points
function startTriping(startPoint, endPoint) {
  directionsDisplay.setMap(map);
  directionsService.route({
    //convert origin and destinations into lat and lng
    origin: startPoint,
    destination: endPoint,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response);
    } else {
        window.alert('Directions request failed due to ' + status);
    }
  });
  // show directions here!!!!!!!
  //
  //
  //
  //
  //
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