// default map, localstorage and the user's starting address
var map, localStorage, startingAddress;
// firebase root
var dbRef;
// geoCoder variable to change address to lat and lng
var geocoder;
// random ints for randomizing the trip
var randomRest1, randomRest2, randomRet, randomAct;
// diretionPanel holds the diretions
var directionPanel;
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
// method of travel
var methodTravel, options, selectedMode;
// display distance only once
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
  markerImg1.src = "../image/mapMarkerB.png";
  markerImg1.alt = "B Marker Image";
  markerImg2.src = "../image/mapMarkerC.png";
  markerImg2.alt = "C Marker Image";
  markerImg3.src = "../image/mapMarkerD.png";
  markerImg3.alt = "D Marker Image";
  markerImg4.src = "../image/mapMarkerE.png";
  markerImg4.alt = "E Marker Image";

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

  // generializing images with class
  markerImg1.setAttribute("class", "markerImg");
  markerImg2.setAttribute("class", "markerImg");
  markerImg3.setAttribute("class", "markerImg");
  markerImg4.setAttribute("class", "markerImg");
  var markerImgs = document.getElementsByClassName("markerImg");

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
    //css for images
    markerImgs[i].style.width = "30px";
    markerImgs[i].style.height = "45px";
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
    descriptions[i].style.width = "55%";
    descriptions[i].style.height = "90px";
    descriptions[i].style.fontSize = "15px";
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
    buttons[i].style.textAlign = "center";
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
       var picture = document.createElement("IMG");
       // download image from firebase storage
       // Create a reference with an initial file path and name
       var storage = firebase.storage();
       var storageRef = storage.ref();
       //path : 'EcoGo/[name of the file which is the name of each place]
       storageRef.child('EcoGo/' + myTrip[0][btnMoreInfo.id]).getDownloadURL().then(function (url) {

           var xhr = new XMLHttpRequest();
           xhr.responseType = 'blob';
           xhr.onload = function (event) {
               var blob = xhr.response;
           };
           xhr.open('GET', url);
           xhr.send();

           //create imagr\
           picture.src = url;
           picture.style.height = "300px";
           picture.style.width = "100%";
       }).catch(function (error) {
           // Handle any errors
           console.log("IMAGE NOT FOUND")
       });

      // reCssing using dom after more info button is clicked
      document.getElementById("map").style.visibility = "hidden";
      trip1.style.display = "none";
      trip2.style.display = "none";
      trip3.style.display = "none";
      trip4.style.display = "none";
      document.getElementById("reroute").style.display = "none";
      document.getElementById("go").style.display = "none";
      // creating elements using dom
      var back = document.createElement("button");
      var desMoreInfo = document.createElement("div");
      var imgProfileDiv = document.createElement("div");
      var titleDiv = document.createElement("div");
      mainDiv.style.marginTop = "-80px";
      // css for titleDiv
      titleDiv.style.width = "300px";
      titleDiv.style.height = "50px";
      titleDiv.style.position = "absolute";
      titleDiv.style.margin = "-320px 0";
      titleDiv.innerHTML = myTrip[0][btnMoreInfo.id];
      titleDiv.style.fontSize = "25px";
      titleDiv.style.fontWeight = "bold";
      titleDiv.style.fontFamily = "sans-serif";
      // css for bakc button 
      back.innerHTML = "X";
      back.style.fontSize = "20px";
      back.style.textAlign = "center";
      back.style.position = "absolute";
      back.style.width = "35px";
      back.style.height = "35px";
      back.style.margin = "-57px 0 0 300px";
      back.style.border = "1px solid black";
      back.style.backgroundColor = "white";
      back.style.color = "black";
      // css for description in more info
      desMoreInfo.style.height = "200px";
      desMoreInfo.style.margin = "60px 5px";
      desMoreInfo.innerHTML = myTrip[3][btnMoreInfo.id];
      desMoreInfo.style.fontFamily = "sans-serif";
      desMoreInfo.style.fontSize = "20px";
      // css for img profile div
      imgProfileDiv.style.position = "absolute";
      imgProfileDiv.style.height = "300px";
      imgProfileDiv.style.width = "95%";
      imgProfileDiv.style.margin = "-390px auto";
      // appending elements into mainDiv
      document.getElementById("container").appendChild(imgProfileDiv);
      imgProfileDiv.appendChild(picture);
      mainDiv.appendChild(back);
      mainDiv.appendChild(desMoreInfo);
      mainDiv.appendChild(titleDiv);
      // onClickFunction for back button
      back.addEventListener("click", function () {
      showRoute();
      document.getElementById("map").style.visibility = "visible";
      imgProfileDiv.style.display = "none";
      titleDiv.style.display = "none";
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
  // creating elements
  var doneButton;
  var nextButtonDiv = document.createElement("div");
  var nextButton = document.createElement("button");
  var prevButtonDiv = document.createElement("div");
  var prevButton = document.createElement("button");
  var destNames = document.createElement("div");
  options = document.createElement("select");
  var walking = document.createElement("option");
  var biking = document.createElement("option");
  var trans = document.createElement("option");
  directionPanel = document.createElement("div");
  methodTravel = document.createElement("div");

  // appending elements
  mainDiv.appendChild(nextButtonDiv);
  mainDiv.appendChild(prevButtonDiv);
  mainDiv.appendChild(methodTravel);
  methodTravel.appendChild(options);
  options.appendChild(biking);
  options.appendChild(walking);
  options.appendChild(trans);
  methodTravel.appendChild(destNames);
  mainDiv.appendChild(directionPanel);
  nextButtonDiv.appendChild(nextButton);
  prevButtonDiv.appendChild(prevButton);
  trip1.style.borderBottom = "0px";
  // values for options
  walking.innerHTML = "Walking";
  biking.innerHTML = "Bicycling";
  trans.innerHTML = "Transit";
  walking.value = "WALKING";
  biking.value = "BICYCLING";
  trans.value = "TRANSIT";
  // innerhtml for destination names
  destNames.innerHTML = "<b>From</b> : " + wholeTrip[trackRoute] + "<br>&#8942;<br><b>To</b> : " + myTrip[0][trackRoute];
  // css for destination names, from ... to ...
  destNames.style.width = "300px";
  destNames.style.fontSize = "13pt";
  destNames.style.marginTop = "10px";

  // css for previous button
  prevButtonDiv.style.display = "none";
  prevButtonDiv.style.width = "100px";
  prevButtonDiv.style.height = "45px";
  prevButtonDiv.style.position = "absolute";
  prevButtonDiv.style.marginTop = "-45px";
  prevButton.style.width = "100px";
  prevButton.style.height = "45px";
  prevButton.innerHTML = "Previous";
  prevButton.style.textAlign = "center";
  mainDiv.style.marginTop = "35px";
  // css for method travel container
  options.style.fontSize = "12pt";
  methodTravel.style.margin = "20px 0";
  methodTravel.style.borderTop = "1px solid black";
  methodTravel.style.paddingTop = "10px";
  // css for next button
  nextButtonDiv.style.width = "100px";
  nextButtonDiv.style.height = "45px";
  nextButtonDiv.style.margin = "-30px 0 0 260px";
  nextButton.style.width = "100px";
  nextButton.style.height = "45px";
  nextButton.style.position = "absolute";
  nextButton.innerHTML = "Next";
  nextButton.style.textAlign = "center";
  // css for direction panel
  directionPanel.style.width = "95%";
  directionPanel.style.margin = "-10px auto";
  // zoom in map
  startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
  options.addEventListener('change', function() {
    startTriping(wholeTrip[trackRoute-1], wholeTrip[trackRoute]);
  });
  // onlick next button
  nextButton.addEventListener("click", function(){
    destNames.innerHTML = "<b>From</b> : " + myTrip[0][trackRoute-1] + "<br>&#8942;<br><b>To</b> : " + myTrip[0][trackRoute];
    startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
    if(trackRoute == 4){
      nextButton.style.display = "none";
      doneButton = document.createElement("button");
      doneButton.style.width = "100px";
      doneButton.style.height = "45px";
      doneButton.innerHTML = "Done";
      doneButton.style.textAlign = "center";
      nextButtonDiv.appendChild(doneButton);
      doneButton.addEventListener("click", function(){
        window.location = "../html/finishdirection.html";
      });
    }
    // create the provious button
    if(trackRoute == 2){
      prevButtonDiv.style.display = "block";
    }
  });
  // onclick previous button 
  prevButton.addEventListener("click", function(){
    if(trackRoute == 4){
      doneButton.style.display = "none";
      nextButton.style.display = "block";
    }
    if(trackRoute == 2) {
      destNames.innerHTML = "<b>From</b> : " + wholeTrip[trackRoute-2] + "<br>&#8942;<br><b>To</b> : " + myTrip[0][trackRoute-2];
      startTriping(wholeTrip[trackRoute-2], wholeTrip[trackRoute-1]);
      prevButtonDiv.style.display = "none";
      trackRoute--;
    } else {
      destNames.innerHTML = "<b>From</b> : " + myTrip[0][trackRoute-3] + "<br>&#8942;<br><b>To</b> : " + myTrip[0][trackRoute-2];
      startTriping(wholeTrip[trackRoute-2], wholeTrip[trackRoute-1]);
      trackRoute--;
    }
  });
}
// show the route of two points and directions
function startTriping(startPoint, endPoint) {
  selectedMode = options.value;
  // show the route on map
  directionsDisplay.setMap(map);
  // show the directions in directionPanel
  directionsDisplay.setPanel(directionPanel);
  directionsService.route({
    //convert origin and destinations into lat and lng
    origin: startPoint,
    destination: endPoint,
    travelMode: selectedMode
  }, function (response, status) {
    if (status === 'OK') {
        directionsDisplay.setDirections(response);
    } else {
        window.alert('Directions request failed due to ' + status);
    }
  });
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