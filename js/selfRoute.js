var map;
var directionsService;
var directionsDisplay;
var dbRef;
var actArr = [[], [], [], []];
var retArr = [[], [], [], []];
var restArr = [[], [], [], []];
var myDestinations = [[],[]];
var geocoder;
var typeList;
var countDest = document.createElement("button");
countDest.id = "count";

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

function createEmptyMap() {
    getPlaces("Restaurant");
    getPlaces("Activity");
    getPlaces("Retailer");

    //show pinpoints of places that user added to their trip
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    // set the map centered to downtown Vancouver
    //zoom : 12
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11.5,
        center: { lat: 49.2827, lng: -123.1207 }, //downtown vancouver
        disableDefaultUI: true,
        zoomControl: true
    });

    showThreeOption();
    showDestinations(myDestinations);
    showPinPoints(localStorage.getItem("myAddress"))
}

function showDestinations(array) {

    countDest.innerHTML = "DESTINATIONS: " + array[0].length;
    document.getElementById("map").appendChild(countDest);
    if (array[0].length > 0) {
        addStartBtn();
    }
}

function showPinPoints(address) {
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
            });
        }
    });
}

// initial screen, shows [FOOD STORES ACTIVITIES]
function showThreeOption() {
    // div underneath the map
    var threeOptions = document.getElementById("content");

    // one div, one btn for each option
    //FOOD
    var optFood = document.createElement("div");
    optFood.id = "optFood";
    //button for Food
    var btnFood = document.createElement("button");
    btnFood.id = "Restaurant";
    btnFood.innerHTML = "Restaurant";
    optFood.appendChild(btnFood);

    //STORES
    var optStores = document.createElement("div");
    optStores.id = "optStores";
    //button for stores
    var btnStores = document.createElement("button");
    btnStores.id = "Retailer";
    btnStores.innerHTML = "Retailer";
    optStores.appendChild(btnStores);

    //ACTIVITIES
    var optAct = document.createElement("div");
    optAct.id = "optActivity";
    //button for activities
    var btnAct = document.createElement("button");
    btnAct.id = "Activity";
    btnAct.innerHTML = "Activity";
    optAct.appendChild(btnAct);

    threeOptions.appendChild(optFood);
    threeOptions.appendChild(optStores);
    threeOptions.appendChild(optAct);

    //event handler
    btnFood.addEventListener("click", function () {
        showList(btnFood.id);
    })
    btnStores.addEventListener("click", function () {
        showList(btnStores.id);
    })
    btnAct.addEventListener("click", function () {
        showList(btnAct.id);
    })
}

// shows the list of place, btnid is either food, store, activity
function showList(type) {

    // empty the previous content
    var content = document.getElementById("content");
    content.innerHTML = "";

    var textContainer = document.createElement("div");
    var category = document.createElement("div");
    var title = type.toUpperCase();
    category.innerHTML = title;
    category.id = "category";

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

    for (var i = 0; i < typeList[0].length; i++) {
        var smallDivs = document.createElement("div");
        smallDivs.id = "smallDivs" + i;
        smallDivs.innerHTML = typeList[0][i] + "</br>";

        var btnMore = document.createElement("button");
        btnMore.innerHTML = "MORE";
        btnMore.id = "btnMore" + i;

        showMoreInfo(btnMore, btnMore.id, type);
    
        smallDivs.appendChild(btnMore);
        textContainer.appendChild(smallDivs);
    
    }
    content.appendChild(textContainer);

    for(var i = 0; i<typeList[1].length;i++){
        showPinPoints(typeList[1][i]);
    }
}

//extract number from string, so that the id matches with the index of firebase database
function getId(btnId) {
    var id = btnId.match(/\d/g);
    id = id.join("");
    return id;
}

function showMoreInfo(btn, btnId, type) {
    btn.addEventListener("click", function () {
        var id = getId(btnId);
        // clear out the lists
         var content = document.getElementById("content");
         content.innerHTML = " ";
         var name = document.createElement("div");
         name.id = "placeName";
         name.innerHTML = typeList[0][id].toUpperCase();

         var address = document.createElement("div");
         address.id = "address";
         address.innerHTML =  typeList[1][id]

         content.appendChild(name);
         content.appendChild(address);

        var btnMoreInfo = document.createElement("button");
        btnMoreInfo.id = "moreInfo" + id;
        btnMoreInfo.innerHTML = "MORE INFO";

        showLocationDetails(btnMoreInfo, btnMoreInfo.id, type);

        var btnAddToTrip = document.createElement("button");
        btnAddToTrip.id = "addToTrip" + id;
        btnAddToTrip.innerHTML = "ADD TO TRIP";
    
        for(var i = 0; i<myDestinations[0].length;i++){
            if(myDestinations[0][i] === typeList[0][id]){
                btnAddToTrip.innerHTML = "ADDED TO TRIP";
                btnAddToTrip.disabled = true;
                addStartBtn();

            }
        }
        addToTrip(btnAddToTrip, btnAddToTrip.id);

        var back = document.createElement("button");
        back.innerHTML = "BACK";
        back.id = "backToList";
        back.addEventListener("click", function () {
            showList(type);
        });

        content.appendChild(btnMoreInfo);
        content.appendChild(btnAddToTrip);
        content.appendChild(back);
    });
}
function addStartBtn() {
    var startTrip = document.createElement("button");
    startTrip.id = "startTrip";
    startTrip.innerHTML = "START";
    document.getElementById("map").appendChild(startTrip);

    startTrip.addEventListener("click", function () {
        localStorage.setItem("myDestination", JSON.stringify(myDestinations));
        window.location = "startRoute.html";
    })
}
function showRoute() {
    console.log("trip started");

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11.5,
        center: { lat: 49.2827, lng: -123.1207 }//downtown vancouver
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function setUpWayPoints() {
    var addresses = JSON.parse(localStorage.getItem("myDestination"));
    var waypts = [];
    for (var i = 0; i < addresses[0].length; i++) {
        waypts.push({
            location: addresses[1][i],
            stopover: true
        });
    }
    return waypts;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = setUpWayPoints();
    var origin = localStorage.getItem("myAddress");

    directionsService.route({
        //convert origin and destinations into lat and lng
        origin:origin,
        destination: waypts[waypts.length-1]["location"],//bcit downtown;
        waypoints: waypts,//last destination
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

function showLocationDetails(btn, btnId, type) {
    btn.addEventListener("click", function () {
        var id = getId(btnId);
        var info = document.getElementById("list");
        info.innerHTML = "";
        info.innerHTML = typeList[--id];
        var back = document.createElement("button");
        back.id = "backToList";
        back.innerHTML = "BACK";
        info.appendChild(back);
        back.addEventListener("click", function () {
            showList(type);
        })
    })
}

function addToTrip(btn, btnId) {
    btn.addEventListener("click", function () {

        var id = getId(btnId);
        myDestinations[0][id] = typeList[0][id];
        myDestinations[1][id] = typeList[1][id];
        
         document.getElementById("addToTrip" + id).innerHTML = "ADDED TO TRIP";
         document.getElementById("addToTrip" + id).disabled = true;
    
         if(myDestinations[0].length ==0){
            addStartBtn();
         }  
    
    });
}

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

            if (type == "Restaurant") {
                restArr[0][i] = name;
                restArr[1][i] = street + ", " + city + ", " + state;
                restArr[2][i] = type;
                restArr[3][i] = des;
            } else if (type == "Retailer") {

                retArr[0][i] = name;
                retArr[1][i] = street + " ," + city + " ," + state;
                retArr[2][i] = type;
                retArr[3][i] = des;
            } else {
                actArr[0][i] = name;
                actArr[1][i] = street + " ," + city + " ," + state;
                actArr[2][i] = type;
                actArr[3][i] = des;
            }
        }
    });
}