var map;
var directionsService;
var directionsDisplay;
var dbRef;

// marker with blue color to show starting address
var markerBlue = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
// marker with red color to show destinations
var markerRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

// arrays to store place info
// [[name],[address],[type], [description]]
var actArr = [[], [], [], []];
var retArr = [[], [], [], []];
var restArr = [[], [], [], []];

//array to store the destinations selected by users
//[[name],[address]]
var myDestinations = [[], []];
var geocoder;

// one of the three arrays will be assigned to this typeList
var typeList;

//button to show how many destinations user have selected
var countDest = document.createElement("button");
countDest.id = "count";

var textHolder;

function self() {
    // check if user entry is empty
    var fill = document.getElementById('adEntry').value;
    if (fill == "") {
        alert("Enter Your Location");
    } else {
        var address = document.getElementById('adEntry').value;
        localStorage.setItem("myAddress", address);
        window.location = "./html/selfRoute.html";
    }
}

//initial map page centered at user's location
function createEmptyMap() {
    // get all the location info from firebase
    getPlaces("Restaurant");
    getPlaces("Activity");
    getPlaces("Retailer");

    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: 49.2827, lng: -123.1207 }, //downtown vancouver
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
    });

    showThreeOption();
    showDestinations(myDestinations);
    //show pinpoints of current location
    showPinPoints(localStorage.getItem("myAddress"), markerBlue);
    if (myDestinations[0].length > 0) {
        addStartBtn();
    }
}

 //updates destination count
function showDestinations(array) {
    countDest.innerHTML = "DESTINATIONS: " + array[0].length;
    document.getElementById("map").appendChild(countDest);

    for(var i = 0; i<myDestinations[1].length;i++){
        showPinPoints(myDestinations[1][i], markerRed);    }
}

// convert each address to lat and lng and place marker
function showPinPoints(address, markerURL) {
    geocoder.geocode({ "address": address }, function (results, status) {
        if ((status == google.maps.GeocoderStatus.OK)) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var myLatLng = {
                lat: latitude, lng: longitude
            }
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: {
                    url: markerURL,
                },
                animation: google.maps.Animation.DROP,
            });
        }
    });
}

// shows [FOOD STORES ACTIVITIES]
function showThreeOption() {
    // div underneath the map
    var threeOptions = document.getElementById("content");

    // one div, one btn for each option
    //FOOD
    var optRestaurant = document.createElement("div");
    optRestaurant.id = "optRestaurant";

    //button for Food
    var btnFood = document.createElement("button");
    btnFood.id = "Restaurant";

//food icon div
var iconFood = document.createElement("div");
iconFood.id = "iconFood";
btnFood.appendChild(iconFood);
    btnFood.innerHTML += "Restaurant";
    optRestaurant.appendChild(btnFood);

    //STORES
    var optRetailer = document.createElement("div");
    optRetailer.id = "optRetailer";
    //button for stores
    var btnRetailer = document.createElement("button");
    btnRetailer.id = "Retailer";

    //store icon div
    var iconRetailer = document.createElement("div");
    iconRetailer.id = "iconRetailer";
    btnRetailer.appendChild(iconRetailer);
    btnRetailer.innerHTML += "Retailer";
    optRetailer.appendChild(btnRetailer);

    //ACTIVITIES
    var optAct = document.createElement("div");
    optAct.id = "optActivity";
    //button for activities
    var btnAct = document.createElement("button");
    btnAct.id = "Activity";

    //act icon div
    var iconAct = document.createElement("div");
    iconAct.id = "iconAct";
    btnAct.appendChild(iconAct);
    btnAct.innerHTML += "Activity";
    optAct.appendChild(btnAct);

    threeOptions.appendChild(optRestaurant);
    threeOptions.appendChild(optRetailer);
    threeOptions.appendChild(optAct);

    //event handler
    btnFood.addEventListener("click", function () {
        showList(btnFood.id);
    })
    btnRetailer.addEventListener("click", function () {
        showList(btnRetailer.id);
    })
    btnAct.addEventListener("click", function () {
        showList(btnAct.id);
    })
}

// shows the list of place, type is either food, store, activity
function showList(type) {

    // empty the previous content
    var content = document.getElementById("content");
    content.innerHTML = "";

    var container = document.createElement("div");
    container.id = "container";
    
   //div to print what users have selected either restaurant, retailer, activity
   var category = document.createElement("div");
   var categotyText = document.createElement("div");
   categotyText.innerHTML = type.toUpperCase();
   categotyText.id = "categoryText"
   category.id = "category";
   category.appendChild(categotyText);

    // back button to go back to three options screen
    var back = document.createElement("button");
    back.id = "back";
    back.innerHTML = "X";
    back.addEventListener("click", function () {
        //shows three options again
        content.innerHTML = "";
        //showThreeOption();
        createEmptyMap();
    })
    category.appendChild(back);

    content.appendChild(category);

    if (type == "Restaurant") {
        typeList = restArr;
    } else if (type == "Retailer") {
        typeList = retArr;
    } else {
        typeList = actArr;
    }

    //one div for each place, create the more btn as well
    for (var i = 0; i < typeList[0].length; i++) {
        var smallDivs = document.createElement("div");
        smallDivs.id = "smallDivs" + i;
       // marker icon 
       var markerImg = document.createElement("IMG");
       markerImg.setAttribute("src", markerRed);

       // div for marker
       var markerHolder = document.createElement("div");
       markerHolder.id = "markerHolder";
       markerHolder.appendChild(markerImg);

       //div for text
        textHolder = document.createElement("div");
        textHolder.id = "textHolder" + i;

       var name = typeList[0][i];
       textHolder.innerHTML = name + "<br><br>";
       textHolder.innerHTML += type + "<br><br>";

       var directionsService = new google.maps.DirectionsService;
       calculateAndDisplayRouteDistance(directionsService, typeList[1][i], textHolder.id);

       // div for button
       var buttonHolder = document.createElement("div");
       buttonHolder.id = "buttonHolder";

       // i button for more info
       var btnMore = document.createElement("button");
       btnMore.innerHTML = "i";
       btnMore.id = "btnMore" + i;

       buttonHolder.appendChild(btnMore);

       //event handler for more btn
       showMoreInfo(btnMore, btnMore.id, type);

       smallDivs.appendChild(markerHolder);
       smallDivs.appendChild(textHolder);
       smallDivs.appendChild(buttonHolder);
       container.appendChild(smallDivs);

       showPinPoints(typeList[1][i], markerRed);

    }
    content.appendChild(container);
}

//extract number from string, so that the id matches with the index of firebase database
function getId(btnId) {
    var id = btnId.match(/\d/g);
    id = id.join("");
    return id;
}

function showMoreInfo(btn, btnId, type) {
    btn.addEventListener("click", function () {
        var regMap = document.getElementById("map");
        regMap.style.height = "500px";
        regMap.style.position = "relative";
        regMap.style.visibility = "visible";

         // place holder for info
         var info = document.createElement("div");
         info.id = "placeHolder";
        info.innerHTML  = "";

        var infoContent = document.createElement("div");
        infoContent.id = "infoContent";
        infoContent.innerHTML = "DISTANCE &nbsp"
 

        var id = getId(btnId);
        // clear out the lists
        var content = document.getElementById("content");
        content.innerHTML = " ";
        var latitude, longitude;

        var directionsService = new google.maps.DirectionsService;
        calculateAndDisplayRouteDistance(directionsService, typeList[1][id], infoContent.id)

        // converting address into lat and lng for recentering the map
        geocoder.geocode({ "address": typeList[1][id] }, function (results, status) {
            if ((status == google.maps.GeocoderStatus.OK)) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                var myLatLng = {
                    lat: latitude, lng: longitude
                }

                map.setCenter(myLatLng);
                map.setZoom(15);
            }
        });

        // name of the place
        var name = document.createElement("div");
        name.id = "category";
        name.innerHTML = typeList[0][id].toUpperCase();
       
        // more info button
        var btnMoreInfo = document.createElement("button");
        btnMoreInfo.id = "moreInfo" + id;
        btnMoreInfo.innerHTML = "MORE INFO";

        showLocationDetails(btnMoreInfo, btnMoreInfo.id, type);

        //Add To Trip button
        var btnAddToTrip = document.createElement("button");
        btnAddToTrip.id = "addToTrip" + id;
        btnAddToTrip.innerHTML = "ADD TO TRIP";
        addToTrip(btnAddToTrip, btnAddToTrip.id);

        // check if the place is alreay added to myDestination
        for (var i = 0; i < myDestinations[0].length; i++) {
            if (myDestinations[0][i] === typeList[0][id]) {
                btnAddToTrip.innerHTML = "ADDED TO TRIP";
                btnAddToTrip.disabled = true;
            }
        }

        //back to list
        var back = document.createElement("button");
        back.innerHTML = "X";
        back.id = "back";
        back.addEventListener("click", function () {
            showList(type);
        });
        name.appendChild(back);
        info.appendChild(infoContent);

        content.appendChild(name);
        content.appendChild(info);
        content.appendChild(btnMoreInfo);
        content.appendChild(btnAddToTrip);
    });
}
// once there is at least one place chose, user can start the route
function addStartBtn() {

    var startTrip = document.createElement("button");
    startTrip.id = "startTrip";
    startTrip.innerHTML = "START";
    document.getElementById("map").appendChild(startTrip);

    startTrip.addEventListener("click", function () {
        // pass the myDestination array to localStorage
        localStorage.setItem("myDestination", JSON.stringify(myDestinations));
        // then redirect to startRoute html
        
        window.location = "directions.html";

    })
}

// shows the route
function showRoute() {
    console.log("trip started");

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11.5,
        center: { lat: 49.2827, lng: -123.1207 },//downtown vancouver
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}
// set up the places to be stopped by
function setUpWayPoints() {
    var addresses = JSON.parse(localStorage.getItem("myDestination"));
    var waypts = [];
    for (var i = 0; i < addresses[0].length-1; i++) {
        waypts.push({
            location: addresses[1][i],
            stopover: true
        });
    }
    return waypts;
}

//set up the final destination of the trip, which is the last location that user selected
function setUpDestination(){
    var addresses = JSON.parse(localStorage.getItem("myDestination"));
    var dest = [];
    if (addresses[1].length < 2) {
        dest.push({
            location: addresses[1][0],
            stopover: true
        })
    } else {
        dest.push({
            // last place than user have selected
            location: addresses[1][addresses.length - 1],
            stopover: true
        })
    }
    return dest[0]['location'];
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        // last place that user have selected
    var destination = setUpDestination();
        //every place between origin and destination
    var waypts = setUpWayPoints();
        //initial location that user have entered
    var origin = localStorage.getItem("myAddress");

    directionsService.route({
        //convert origin and destinations into lat and lng
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// shows the distance to each place from the current location
function calculateAndDisplayRouteDistance(directionsService, address, textHolder) {
    var origin = localStorage.getItem("myAddress");
    directionsService.route({
        //convert origin and destinations into lat and lng
        origin: origin,
        destination: address,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            var route = response.routes[0];
            for (var i = 0; i < route.legs.length; i++) {
                document.getElementById(textHolder).innerHTML += route.legs[i].distance.text;
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function showLocationDetails(btn, btnId, type) {
    btn.addEventListener("click", function () {
        var picture = document.createElement("IMG");
        picture.id = "myimg";
        var id = getId(btnId);
        // download image from firebase storage
        // Create a reference with an initial file path and name
        var storage = firebase.storage();
        var storageRef = storage.ref();
        //path : 'EcoGo/[name of the file which is the name of each place]
        storageRef.child('EcoGo/' + typeList[0][id]).getDownloadURL().then(function (url) {

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            //create image element
            var img = document.getElementById('myimg');
            img.src = url;
            img.style.height = "300px";
            img.style.width = "100%";

        }).catch(function (error) {
            // Handle any errors
            console.log("IMAGE NOT FOUND")
        });

        document.getElementById("content").innerHTML = "";

        var smallMap = document.getElementById("map");
        smallMap.style.position = "absolute";
        smallMap.style.visibility = "hidden";

        var info = document.getElementById("content");
        info.innerHTML = "";

        //picture 
        var pictureHolder = document.createElement("div");
        pictureHolder.id = "pictureHolder";
        pictureHolder.appendChild(picture);

        //name
        var name = document.createElement("div");
        name.id = "category";
        name.innerHTML = typeList[0][id] + "</br>";

        // detail
        var detailHolder = document.createElement("div");
        detailHolder.id = "detailHolder";
        detailHolder.style.height = "250px";

        var detailHolderContent  = document.createElement("div");
        detailHolderContent.id = "detailHolderContent"
        detailHolderContent.innerHTML = " &nbsp&nbsp&nbsp&nbsp" + typeList[1][id] + "<br><br>";
        detailHolderContent.innerHTML += typeList[3][id] + "<br><br>";
        detailHolder.appendChild(detailHolderContent);

        var btnAddToTrip = document.createElement("button");
        btnAddToTrip.id = "addToTrip" + id;
        btnAddToTrip.innerHTML = "ADD TO TRIP";

        // check if the place is alreay added to myDestination
        for (var i = 0; i < myDestinations[0].length; i++) {
            if (myDestinations[0][i] === typeList[0][id]) {
                btnAddToTrip.innerHTML = "ADDED TO TRIP";
                btnAddToTrip.disabled = true;
            }
        }

        btnAddToTrip.style.position = "relative";
        btnAddToTrip.style.left = "195px";

        addToTrip(btnAddToTrip, btnAddToTrip.id);

        var btnBack = document.createElement("button");
        btnBack.id = "back"
        btnBack.innerHTML = "X";
        showMoreInfo(btnBack, btnId, type);

        name.appendChild(btnBack);

        info.appendChild(pictureHolder);
        info.appendChild(name);
        info.appendChild(detailHolder);
        info.appendChild(btnAddToTrip);
    })
    }

//add selected location to myDestiantions
function addToTrip(btn, btnId) {
    btn.addEventListener("click", function () {

        var id = getId(btnId);
        myDestinations[0].push(typeList[0][id]);
        myDestinations[1].push(typeList[1][id]);

        document.getElementById("addToTrip" + id).innerHTML = "ADDED TO TRIP";
        document.getElementById("addToTrip" + id).disabled = true;
        document.getElementById("count").innerHTML = "DESTINATIONS: " + myDestinations[0].length;

        if (myDestinations[0].length == 1) {
            addStartBtn();
        }

    });
}

// get info from firebase
function getPlaces(type) {
    //database path
    dbref = firebase.database().ref(type);
    dbref.on('value', function (snap) {
        var info = snap.val();
        var keys = Object.keys(info);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var name = info[k].Name;
            var street = info[k].Street;
            var city = info[k].City;
            var state = info[k].State;
            var zip = info[k].ZipCode;
            var type = info[k].Category;
            var des = info[k].Description;
            var address = street + ", " + city + ", " + state;


            if (type == "Restaurant") {
                restArr[0][i] = name;
                restArr[1][i] = address;
                restArr[2][i] = type;
                restArr[3][i] = des;
            } else if (type == "Retailer") {

                retArr[0][i] = name;
                retArr[1][i] = address;
                retArr[2][i] = type;
                retArr[3][i] = des;
            } else {
                actArr[0][i] = name;
                actArr[1][i] = address;
                actArr[2][i] = type;
                actArr[3][i] = des;
            }
        }
    });
}