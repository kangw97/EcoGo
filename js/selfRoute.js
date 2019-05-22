var map;
// global marker since they are used in many functions
var marker;
// database reference
var dbRef;
// for getting direction service api
var directionsService;
// for show directions on map service api
var directionsDisplay;
// stores all the destinations
var wholeTrip = [];
var addOneTime = 0;
// marker with blue color to show starting address
var markerBlue = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
// marker with red color to show destinations
var markerRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
//  stores all the info
var mainDiv;
// diretionPanel holds the diretions
var directionPanel;
// method of travel
var methodTravel, options, selectedMode;
// trackRoute to keep track of index
var trackRoute = 0;
// arrays to store place info
// [[name],[address],[type], [description], [website]]
var actArr = [[], [], [], [], []];
var retArr = [[], [], [], [], []];
var restArr = [[], [], [], [], []];

//array to store the destinations selected by users
//[[name],[address]]
var myDestinations = [[], []];
var geocoder;

// one of the three arrays will be assigned to this typeList
var typeList;

//button to show how many destinations user have selected
var countDest = document.createElement("button");
countDest.id = "count";

// the content of the textHolder gets changed in more than one method
var textHolder;

function self() {
    // check if user entry is empty
    var fill = document.getElementById('adEntry').value;
    if (fill == "") {
        alert("Enter Your Location");
    } else {
        // user's current location (the address they typed in on the homepage)
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

    //shows the three options/category
    showThreeOption();

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: 49.2827, lng: -123.1207 }, //downtown vancouver
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
    });

    // show the pin points of all the locations that was added to the user's trip
    showDestinations(myDestinations);

    //show pinpoints of current location using blue marker
    showPinPoints(localStorage.getItem("myAddress"), markerBlue);
    
    // add the start button only for the first time
    if (addOneTime > 0) {
        addStartBtn();
    }
}

//updates destination count
function showDestinations(array) {
    countDest.innerHTML = "DESTINATIONS: " + array[0].length;
    document.getElementById("map").appendChild(countDest);
    // show the pinpoints of every places in the array 
    for (var i = 0; i < array[1].length; i++) {
        showPinPoints(array[1][i], markerRed);
    }
}

// convert each address to lat and lng and place marker
// markerURL is the color of the marker
function showPinPoints(address, markerURL) {
    geocoder.geocode({ "address": address }, function (results, status) {
        if ((status == google.maps.GeocoderStatus.OK)) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var myLatLng = {
                lat: latitude, lng: longitude
            };
            // marker
            marker = new google.maps.Marker({
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
    var regMap = document.getElementById("map");
    regMap.style.height = "550px";
    showPinPoints(localStorage.getItem("myAddress"), markerBlue);
    // div underneath the map
    var threeOptions = document.getElementById("content");

    // one div, one button for each option
    //FOOD
    var optRestaurant = document.createElement("div");
    optRestaurant.id = "optRestaurant";
    //button for Food
    var btnFood = document.createElement("button");
    btnFood.id = "Restaurant";
    //food icon div
    var iconFood = document.createElement("div");
    iconFood.id = "iconFood";
    // actual icon for food
    var iconForFood = document.createElement("IMG");
    iconForFood.id = "iconFor";
    iconForFood.src = "../image/Restaurant_icon.png";
    //append the icon on the div
    iconFood.appendChild(iconForFood);
    // append the div on the button
    btnFood.appendChild(iconFood);
    // text for the food button
    btnFood.innerHTML += "RESTAURANTS";
    optRestaurant.appendChild(btnFood);

    //RETAILER
    var optRetailer = document.createElement("div");
    optRetailer.id = "optRetailer";
    //button for stores
    var btnRetailer = document.createElement("button");
    btnRetailer.id = "Retailer";
    //store icon div
    var iconRetailer = document.createElement("div");
    iconRetailer.id = "iconRetailer";
    //actual icon for the retailer
    var iconForRet = document.createElement("IMG");
    iconForRet.id = "iconFor";
    iconForRet.src = "../image/Retailer_icon.png";
    //append the icon on the div
    iconRetailer.appendChild(iconForRet);
    //append the div on the button
    btnRetailer.appendChild(iconRetailer);
    //text for the retailer button
    btnRetailer.innerHTML += "RETAILERS";
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
    // actual icon for the activity
    var iconForAct = document.createElement("IMG");
    iconForAct.id = "iconFor";
    iconForAct.src = "../image/Activity_icon.png";
    //append the icon on the div
    iconAct.appendChild(iconForAct);
    //append the div on the button
    btnAct.appendChild(iconAct);
    //text for the activity button
    btnAct.innerHTML += "ACTIVITY";
    optAct.appendChild(btnAct);

    //append three divs on the div underneath the map
    threeOptions.appendChild(optRestaurant);
    threeOptions.appendChild(optRetailer);
    threeOptions.appendChild(optAct);

    //event handler, pass in the btnFood.id which is the type
    btnFood.addEventListener("click", function () {
        showList(btnFood.id);
    });
    btnRetailer.addEventListener("click", function () {
        showList(btnRetailer.id);
    });
    btnAct.addEventListener("click", function () {
        showList(btnAct.id);
    });
}


// shows the list of place, type is either food, store, activity
function showList(type) {
 // resizing the map to show more of the list
 var regMap = document.getElementById("map");
 regMap.style.height = "300px";
 // empty the previous content
 var content = document.getElementById("content");
 content.innerHTML = "";
 var container = document.createElement("div");
 container.id = "container";
 // icon for each category
 var smallIcon = document.createElement("IMG");
 smallIcon.id = "smallIcon";
 smallIcon.src = "../image/" + type + "_icon.png";
 // div to contain the small icon
 var smallIconDiv = document.createElement("div");
 smallIconDiv.id = "smallIconDiv";
 //append the icon on to the div
 smallIconDiv.appendChild(smallIcon);

 //div to print what users have selected
 //either restaurant, retailer, activity
 var category = document.createElement("div");
 // div for the text
 var categotyText = document.createElement("div");
 // catrgoty gets printed in uppercase
 // append "S" for restaurant and retaielr
 if (type === "Restaurant" || type === "Retailer") {
     categotyText.innerHTML += "<b>" + type.toUpperCase() + "S" + "</b>";
 } else {
     categotyText.innerHTML += "<b>" + type.toUpperCase() + "</b>";
 }
 categotyText.id = "categoryText";
 categotyText.style.fontSize = "25px";
 category.id = "category";
 categotyText.appendChild(smallIconDiv);
 category.appendChild(categotyText);

 // back button to go back to three options screen
 var back = document.createElement("button");
 back.style.position = "absolute";
 back.style.right = "25px";
 back.style.top = "25px";
 back.id = "back";
 back.innerHTML = "X";
 back.addEventListener("click", function () {
     content.innerHTML = "";
     createEmptyMap();
 });

 // append the back button on to the category div
 category.appendChild(back);
 content.appendChild(category);

 // assign the typelist depends on the parameter type
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

     //name of the place
     var name = typeList[0][i];
     // descriptiom of the place
     var desc = typeList[3][i];
     // only shows the 40 characters of the description
     desc = desc.substr(0, 40);
     desc += "...";
     // prints name followed by the 40 char desc
     textHolder.innerHTML = "<b>" + name + "</b><br><br>";
     textHolder.innerHTML += desc + "<br><br>";

     // to calculate the distance to each place from the current location
     directionsService = new google.maps.DirectionsService();
     calculateAndDisplayRouteDistance(
         directionsService, typeList[1][i], textHolder.id);

     // div for button
     var buttonHolder = document.createElement("div");
     buttonHolder.id = "buttonHolder";

     // i button for more info
     var btnMore = document.createElement("button");
     btnMore.innerHTML = "i";
     btnMore.id = "btnMore" + i;

     buttonHolder.appendChild(btnMore);

     //event handler for more button
     showMoreInfo(btnMore, btnMore.id, type);

     // append all the elements that have to be on each smallDiv
     smallDivs.appendChild(markerHolder);
     smallDivs.appendChild(textHolder);
     smallDivs.appendChild(buttonHolder);
     container.appendChild(smallDivs);

     // show the pinpoints of the each place on the list
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
        // resize the map and make it visible
        var regMap = document.getElementById("map");
        regMap.style.height = "500px";
        regMap.style.position = "relative";
        regMap.style.visibility = "visible";

        // place holder for info
        var info = document.createElement("div");
        info.id = "placeHolder";
        info.innerHTML = "";

        // div to print the distance to each place
        var infoContent = document.createElement("div");
        infoContent.id = "infoContent";
        infoContent.innerHTML = "DISTANCE &nbsp";
        // get the id(index)
        var id = getId(btnId);
        // clear out the lists
        var content = document.getElementById("content");
        content.innerHTML = " ";
        var latitude, longitude;

        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        // get the distance to that specific place from current location
        calculateAndDisplayRouteDistance(
            directionsService, typeList[1][id], infoContent.id);

        //reinitialize the map so that they can be centered and zoomed in
        // to one specific location
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11.5,
            center: { lat: 49.2827, lng: -123.1207 },//downtown vancouver
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: "greedy",

        });
        showDestinations(myDestinations);

        // converting address into lat and lng for recentering the map
        geocoder.geocode({ "address": typeList[1][id] },
            function (results, status) {
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();
                    var myLatLng = {
                        lat: latitude, lng: longitude
                    };
                    //recenter the map and zoom into one specific location
                    // show only one marker
                    map.setCenter(myLatLng);
                    map.setZoom(15);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: {
                        url: markerRed,
                    },
                    animation: google.maps.Animation.DROP
                });
            });

        // name of the place
        var name = document.createElement("div");
        name.id = "category";
        name.innerHTML = "<b>" + typeList[0][id].toUpperCase()
            + "</b>" + "<br>";
        name.style.marginTop = "25px";
        name.style.marginLeft = "10px";
        name.style.border = "0";
         name.style.width = "330px";
        name.style.fontSize = "30px";

        // more info button
        var btnMoreInfo = document.createElement("button");
        btnMoreInfo.id = "moreInfo" + id;
        btnMoreInfo.innerHTML = "MORE INFO";

        // event listener to more info button
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
        if (myDestinations[0].length > 0) {
            addStartBtn();
        }
        var backDiv = document.createElement("div");
        backDiv.id = "backDiv";
        backDiv.style.position = "absolute";
        backDiv.style.margin = "-78px 0 0 360px";
        backDiv.style.width = "35px";

        //back to list
        var back = document.createElement("button");
        back.innerHTML = "X";
        back.id = "back";
        back.addEventListener("click", function () {
            showList(type);
        });
        back.style.position = "absolute";
        back.style.top = "0";

        backDiv.appendChild(back);

       // name.appendChild(back);
        info.appendChild(infoContent);

        content.appendChild(name);
        content.appendChild(backDiv);
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
        document.getElementById("count").style.display = "none";
        document.getElementById("startTrip").style.display = "none";
        document.getElementById("map").style.height = "400px";
        document.getElementById("content").style.display = "none";

        // store trip address into one array
        wholeTrip.push(localStorage.getItem("myAddress"));
        for (var i = 0; i < myDestinations[1].length; i++) {
            wholeTrip.push(myDestinations[1][i]);
        }
        // creating elements
        mainDiv = document.createElement("div");
        document.body.appendChild(mainDiv);
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
        // values for options
        walking.innerHTML = "Walking";
        biking.innerHTML = "Bicycling";
        trans.innerHTML = "Transit";
        walking.value = "WALKING";
        biking.value = "BICYCLING";
        trans.value = "TRANSIT";
        // innerhtml for destination names
        destNames.innerHTML = "<b>From</b> : " + wholeTrip[trackRoute] + "<br>&#8942;<br><b>To</b> : " + myDestinations[0][trackRoute];
        // css for destination names, from ... to ...
        destNames.style.width = "300px";
        destNames.style.fontSize = "13pt";
        destNames.style.marginTop = "10px";

        // css for previous button
        prevButtonDiv.style.display = "none";
        prevButtonDiv.style.width = "100px";
        prevButtonDiv.style.height = "45px";
        prevButtonDiv.style.position = "absolute";
        prevButtonDiv.style.margin = "-44px 0 0 0";
        prevButton.style.width = "100px";
        prevButton.style.height = "45px";
        prevButton.style.fontSize = "15pt";
        prevButton.innerHTML = "Previous";
        prevButton.style.textAlign = "center";
        mainDiv.style.margin = "35px auto";
        mainDiv.style.width = "90%";
        // css for method travel container
        options.style.fontSize = "12pt";
        methodTravel.style.margin = "20px 0";
        methodTravel.style.borderTop = "1px solid black";
        methodTravel.style.paddingTop = "10px";
        // css for next button
        nextButtonDiv.style.width = "100px";
        nextButtonDiv.style.height = "45px";
        nextButtonDiv.style.margin = "-20px 0 0 260px";
        nextButton.style.width = "100px";
        nextButton.style.height = "45px";
        nextButton.style.position = "absolute";
        nextButton.style.fontSize = "15pt";
        nextButton.innerHTML = "Next";
        nextButton.style.textAlign = "center";
        // css for direction panel
        directionPanel.style.width = "95%";
        directionPanel.style.margin = "-10px auto";
        doneButton = document.createElement("button");
        doneButton.style.width = "100px";
        doneButton.style.height = "45px";
        doneButton.style.fontSize = "15pt";
        doneButton.innerHTML = "Done";
        doneButton.style.textAlign = "center";
        nextButtonDiv.appendChild(doneButton);
        doneButton.style.display = "none";
        // redirecte to home page
        doneButton.addEventListener("click", function () {
            window.location = "../html/finishdirection.html";
        });
        // zoom in map
        startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
        if (wholeTrip.length == 2) {
            nextButton.style.display = "none";
            doneButton.style.display = "block";
        }
        options.addEventListener('change', function () {
            startTriping(wholeTrip[trackRoute - 1], wholeTrip[trackRoute]);
            console.log(selectedMode);
        });
        // onlick next button
        nextButton.addEventListener("click", function () {
            destNames.innerHTML = "<b>From</b> : " + myDestinations[0][trackRoute - 1] + "<br>&#8942;<br><b>To</b> : " + myDestinations[0][trackRoute];
            startTriping(wholeTrip[trackRoute], wholeTrip[++trackRoute]);
            if (trackRoute == wholeTrip.length - 1 || wholeTrip.length == 2) {
                nextButton.style.display = "none";
                doneButton.style.display = "block";
            }
            // create the provious button
            if (trackRoute == 2) {
                prevButtonDiv.style.display = "block";
            }
        });
        // onclick previous button 
        prevButton.addEventListener("click", function () {
            if (trackRoute == wholeTrip.length - 1 || wholeTrip.length == 2) {
                doneButton.style.display = "none";
                nextButton.style.display = "block";
            }
            if (trackRoute == 2) {
                destNames.innerHTML = "<b>From</b> : " + wholeTrip[trackRoute - 2] + "<br>&#8942;<br><b>To</b> : " + myDestinations[0][trackRoute - 2];
                startTriping(wholeTrip[trackRoute - 2], wholeTrip[trackRoute - 1]);
                prevButtonDiv.style.display = "none";
                trackRoute--;
            } else {
                destNames.innerHTML = "<b>From</b> : " + myDestinations[0][trackRoute - 3] + "<br>&#8942;<br><b>To</b> : " + myDestinations[0][trackRoute - 2];
                startTriping(wholeTrip[trackRoute - 2], wholeTrip[trackRoute - 1]);
                trackRoute--;
            }
        });
    });
}

// show the route of two points and directions
function startTriping(startPoint, endPoint) {
    selectedMode = options.value;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: { lat: 49.2827, lng: -123.1207 },//downtown vancouver
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
    });
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
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
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
                document.getElementById(textHolder).innerHTML += route.legs[i].distance.text + "<br><br>";
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
        //path : "EcoGo/[name of the file which is the name of each place]
        storageRef.child("EcoGo/" + typeList[0][id]).
            getDownloadURL().then(function (url) {
                // to download the image from cloud storage
                var xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = function (event) {
                    var blob = xhr.response;
                };
                xhr.open("GET", url);
                xhr.send();
                //create image element
                var img = document.getElementById("myimg");
                img.src = url;
                img.style.height = "300px";
                img.style.width = "100%";

            }).catch(function (error) {
                // Handle any errors
                console.log("IMAGE NOT FOUND")
            });

        document.getElementById("content").innerHTML = "";

        // hide the map so the picture can be shown
        // on the top of the screen
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
        name.innerHTML = typeList[0][id].toUpperCase() + "</br>";
        name.style.border = "0";
        name.style.marginTop = "15px";
        name.style.fontWeight = "bold";
        name.style.fontSize = "35px";

        // div to hold the details
        var detailHolder = document.createElement("div");
        detailHolder.id = "detailHolder";
        // div to hold the content of the details
        var detailHolderContent = document.createElement("div");
        detailHolderContent.id = "detailHolderContent"
        // hyperlink to the website
        var link = document.createElement("a");
        link.setAttribute("href", typeList[4][id]);
        link.innerHTML = typeList[4][id];
        detailHolderContent.appendChild(link);
        detailHolderContent.innerHTML += "<br><br>";
        detailHolderContent.innerHTML += typeList[3][id] + "<br><br>";
        detailHolder.appendChild(detailHolderContent);
        //add to trip button
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
        // css for the add to trip button
        btnAddToTrip.style.position = "relative";
        btnAddToTrip.style.left = "195px";
        //event listener
        addToTrip(btnAddToTrip, btnAddToTrip.id);
        // back button to go back to previous sreen
        var btnBack = document.createElement("button");
        btnBack.id = "back"
        btnBack.innerHTML = "X";
        showMoreInfo(btnBack, btnId, type);
        name.appendChild(btnBack);
        // append every element that needs to be on the screen
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
        addOneTime++;
        // change the the text when the button is clicked
        document.getElementById("addToTrip" + id).innerHTML = "ADDED TO TRIP";
        //disable the button
        document.getElementById("addToTrip" + id).disabled = true;
        //update the count button
        document.getElementById("count").innerHTML = "DESTINATIONS: "
            + myDestinations[0].length;

        if (addOneTime == 1) {
            addStartBtn();
        }
    });
}

// get info from firebase
function getPlaces(type) {
     //database path
     dbref = firebase.database().ref(type);
     dbref.on("value", function (snap) {
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
             var website = info[k].WebSite;
             var address = street + ", " + city + ", " + state;
             // check the type in order to store the info in the correct array
             if (type == "Restaurant") {
                 restArr[0][i] = name;
                 restArr[1][i] = address;
                 restArr[2][i] = type;
                 restArr[3][i] = des;
                 restArr[4][i] = website;
             } else if (type == "Retailer") {
                 retArr[0][i] = name;
                 retArr[1][i] = address;
                 retArr[2][i] = type;
                 retArr[3][i] = des;
                 retArr[4][i] = website;
             } else {
                 actArr[0][i] = name;
                 actArr[1][i] = address;
                 actArr[2][i] = type;
                 actArr[3][i] = des;
                 actArr[4][i] = website;
             }
         }
     });
}