var map, localStorage, address;
var index=0;
//array to store all the addresses.
//var myAddress = ["5089 Dominion St, Burnaby, BC V5G 1C8", "3700 Wilingdon Ave, Burnaby BC V5G 3H2", "4670 Assembly Way, Burnaby, BC V5H 0H3","4500 Still Creek Dr, Burnaby, BC V5C 0E5"];
//var myAddress = ["3950 Main Street, Vancouver, BC V5V 3P2","550 Clark Drive,Vancouver, BC V5L 3H7", "3995 Main Street, Vancouver, BC V5V 3P3","1185 West Georgia Street, Vancouver, BC V6E 4E6"];
//the number of addresses in array "myAddress"
//var bName = ["Nomad","Agro Coffee Roasters","The Acorn Restaurant","Freshii"];

var currentLocation = localStorage.getItem("myAddress");
var myAddress = [];
myAddress[0] = currentLocation;

//myAddress[0] = currentLocation;
var destinations = JSON.parse(localStorage.getItem('myDestination'));

for (var i = 0; i < destinations[1].length; i++) {
    myAddress.push(destinations[1][i]);
}
//myAddress.push(localStorage.getItem('myDestination'))
console.log(myAddress);
var bName = ["currentLocation"];

for (var i = 0; i < destinations[0].length; i++) {
    bName.push(destinations[0][i]);
}
//myAddress.push(myAddresses[0]);
//console.log(myAddress);
//bName.push(myDestination[0]);
//var length = myAddress.length;
//initialize google map API
var geocoder;
//count the number of next button to prevent creating more than 2 next button.
var nCount = 0;
//count the number of previous button to prevent creating more than 2 previous button.
var pCount=0;
var nextBtn;
var prevBtn;
// marker with blue color to show starting address
var markerBlue = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
// marker with red color to show destinations
var markerRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var myLatLng; 
var count = 0;
var previndex = 0;
// the address of destination
var destLocation = 0;
var prevdiv = 0;

// start location.
var startLocation=0;
var directionsDisplay;
var directionsService;
var today = new Date();
var txt;
var confirmNum=0;
var time = today.getHours() + ":" + today.getMinutes();
//initialize google API map.
function initMap() {
    if (nCount == 0) {
        //make buttons once which is needed for   
        twoP();
        next();
        vehicle();
    }
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.2827, lng: -123.1207 },
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true
    });
    geocoder = new google.maps.Geocoder();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));
    var control = document.getElementById('floating-panel');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    initPoint();
  
    
}
//bring the first two places to make a route.
function initPoint() {
    var latitude = 0;
    var longitude = 0;
    var pageIndex = index;
    for (i = pageIndex; i < pageIndex + 2; i++) {
        geocoder.geocode({'address': myAddress[i] }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();

                myLatLng = { lat: latitude, lng: longitude }

                // place markers
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    icon: {
                        url: markerBlue
                    },
                    animation: google.maps.Animation.DROP,
                });
                map.setZoom(12);
               // map.panTo(marker.postion);
            } else {
                alert('This is the last location! ' + status);
            }
        });
    }

}
function next() {
    if (nCount == 0) {
        var content = document.getElementById("previousNext");
        var nextdiv = document.createElement("div");
        nextdiv.id = "nextdiv";

        nextBtn = document.createElement("button");
        nextBtn.id = "next_btn";
        nextBtn.innerHTML = "NEXT";
        nextdiv.appendChild(nextBtn);
        //content.appendChild(nextdiv);
        //var arrow_right = document.createElement("img");
        //arrow_right.src = "../image/arrow_right.png";
        //arrow_right.id = "next_btn";
        //nextdiv.appendChild(arrow_right);
        content.appendChild(nextdiv);
    }
    // when right arrow button is clicked ,"right-panel" is initialized.
    nextBtn.addEventListener("click", function () {
        nCount++;
        index++;
        console.log(index);

        document.getElementById("nameL").innerHTML = "";
        document.getElementById("right-panel").innerHTML = "";
        twoP();
        nextMap();

        if (index != 0) {
            document.getElementById("prevdiv").style.position = "relative";
            document.getElementById("prevdiv").style.visibility = "visible";
        }
       
    })
}
//create previous button to go previous directions.
function prev() {
    var content = document.getElementById("previousNext");
    if (nCount == 1) {
        if (index == 0) {
            
        }
        else {
            content = document.getElementById("previousNext");
        prevdiv = document.createElement("div");
        prevdiv.id = "prevdiv";
       prevBtn = document.createElement("button");
       prevBtn.id = "prev_btn";
       prevBtn.innerHTML = "PREVIOUS";
       prevdiv.appendChild(prevBtn);
       content.appendChild(prevdiv);
       
        
           //arrow_left = document.createElement("img");
           //arrow_left.src = "../image/arrow_left.png";
           //arrow_left.id = "prev_btn"
           //prevdiv.appendChild(arrow_left);
          // arrowNname.appendChild(prevdiv);
            nCount++;
        }
    }
  
   
    prevBtn.addEventListener("click", function () {
        index--;
        console.log(index);
        if (index == 0) {
            console.log("hi");
            document.getElementById("prevdiv").innerHTML = "";

        }
        previndex++;
        document.getElementById("nameL").innerHTML = "";

        twoP();
        prevMap();
    })
}
// show the name of start location and destination.
function twoP() {
    var twoPlace = document.createElement("div");
    twoPlace.id = "twoPl";

    //connect to "right-panel" in html page.
    var nameL = document.getElementById("nameL");
    var startL = document.createElement("div");
    startL.id = "startL";
    //show the name of eco-friendly places in the name array.
    startL.innerHTML = bName[index];
   
    var arrowsdiv = document.createElement("div");
    var arrows = document.createElement("img");
    arrows.src = "../image/arrows.png";
    arrows.id = "arrows";
    arrowsdiv.appendChild(arrows);
    startL.appendChild(arrowsdiv);
    twoPlace.appendChild(startL);
   
    var destL = document.createElement("div");
    destL.id = "destL";
    destL.innerHTML = bName[index + 1];
    arrowsdiv.appendChild(destL);
    twoPlace.appendChild(arrowsdiv);
    nameL.appendChild(twoPlace);

}
// create buttons for selecting vehicles to travel. 
function vehicle() {

        var selectV = document.getElementById("selectV");
        //A section for button group("Driving, Transit, Walk, Byke")
        var vehdiv = document.createElement("div");
        vehdiv.id = "vehdiv";

        //create button for travel by driving
        var drivingBtn = document.createElement("button");
        drivingBtn.id = "driving_btn"
        drivingBtn.innerHTML = "DRIVING";
        vehdiv.appendChild(drivingBtn);

        //create button for travel by transit
        var transBtn = document.createElement("button");
        transBtn.id = "trans_btn"
        transBtn.innerHTML = "TRANSIT";
        vehdiv.appendChild(transBtn);

        //create button for travel by walk
        var walkBtn = document.createElement("button");
        walkBtn.id = "walk_btn"
        walkBtn.innerHTML = "WALK";
        vehdiv.appendChild(walkBtn);

        //create button for travel by bike
        var bikeBtn = document.createElement("button");
        bikeBtn.id = "bike_btn"
        bikeBtn.innerHTML = "BIKE";
        vehdiv.appendChild(bikeBtn);

        selectV.appendChild(vehdiv);

        
        drivingBtn.addEventListener("click", function () {
            suggestion();
            if (confirmNum == 1) {
                travel_t(directionsService, directionsDisplay);
            } else {
                travel_d(directionsService, directionsDisplay);
            }
         })
        transBtn.addEventListener("click", function () {
            travel_t(directionsService, directionsDisplay);
        })

        walkBtn.addEventListener("click", function () {
            travel_w(directionsService, directionsDisplay);
        })

        bikeBtn.addEventListener("click", function () {
            travel_b(directionsService, directionsDisplay);
        })
    }

// when "Bicycling" button is clicked, set google maps travel mode to 'Bicycling'
function travel_b(directionsService, directionsDisplay) {
    var i = index;
    //when a user press previous button and select Bicycling travel mode, this if-statement will be called. 
    if (previndex == 1) {
        directionsService.route({

            origin: myAddress[i + 1],
            destination: myAddress[i + 2],
            travelMode: 'BICYCLING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        previndex == 0;
    }
    // when a user press next button and select bicycling travel mode, this else block will be implemented.
    else {
        directionsService.route({
            origin: myAddress[i],
            destination: myAddress[i + 1],
            travelMode: 'BICYCLING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    }

// when "walking" button is clicked, set google maps travel mode to 'walking'
function travel_w(directionsService, directionsDisplay) {
    var i = index;
    //when a user press previous button and select 'Walking' travel mode, this if statement is called. 
if (previndex == 1) {
        directionsService.route({

            origin: myAddress[i + 2],
            destination: myAddress[i + 1],
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        previndex == 0;
}
    // when a user press next button and select Walking travel mode, this else block will be implemented.
    else {
        directionsService.route({
            origin: myAddress[i],
            destination: myAddress[i + 1],
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}

// when "Driving" button is clicked, set google maps travel mode to 'Driving'
function travel_d(directionsService, directionsDisplay) {
    var i = index;
    if (previndex == 1) {
        directionsService.route({

            origin: myAddress[i + 2],
            destination: myAddress[i + 1],
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        previndex == 0;
    }
    else {
        directionsService.route({
            origin: myAddress[i],
            destination: myAddress[i + 1],
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}

function travel_t(directionsService, directionsDisplay) {
    var i = index;
    if (previndex == 1) {
        directionsService.route({

            origin: myAddress[i+2],
            destination: myAddress[i+1],
            travelMode: 'TRANSIT'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
            });
        previndex == 0;
 }
    else {
        directionsService.route({

            origin: myAddress[i],
            destination: myAddress[i + 1],
            travelMode: 'TRANSIT'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    
}

function suggestion() {
    if (confirm("Why don't we use transit today? If you still want to drive, please press 'Cancel' button!")) {
        confirmNum = 1;
    } else {
        confirmNum =0;
    }
}
function nextMap() {
    initMap();
    var pageIndex = index;
    for (i = pageIndex; i == pageIndex + 2; i++) {
        startLocation = myAddress[i];
        destLocation = myAddress[i - 1];
        geocoder.geocode({ 'address': myAddress[i] }, function (results, status) {
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
    if (nCount == 1) {
        prev();
    }
    }


function prevMap() {
    initMap();
   
    var pageIndex = index;
    for (i = pageIndex; i < pageIndex + 2; i++) {
        startLocation = myAddress[i+1];
        destLocation = myAddress[i];
        geocoder.geocode({ 'address': myAddress[i] }, function (results, status) {
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
    
}
function finishMap() {
    
}


