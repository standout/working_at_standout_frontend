/*
* NewPost är en dynamisk klass.
*/
function AddSupplier() {
/*
* Globala variabler.
*/
var smallMap = null;
var markersArray = new Array;

var DEFAULT_LOCATION_LAT = 56.8556997;
var DEFAULT_LOCATION_LNG = 14.8290924;
/*
* Funktionen startas när NewPost körs.
*/
	function init() {

		initSmallMap();
	}
/*
* Funktionen skapar en liten karta till när man skriver ett nytt blogginlägg
* Zoomen på den lilla kartan ska ligga på 9.
* initLocation startas.
*/
	function initSmallMap() {

		var canvas				= document.getElementById('smallmap');
		
			var options 			= new Object();
				options.zoom		= 9;
				options.mapTypeId	= google.maps.MapTypeId.ROADMAP;
				
			smallMap = new google.maps.Map(canvas, options);
			initLocation();

		
	}
/*
* Funktionen tar ut användarens position med geolocation.
* Om applikationen inte hittar användarens position så ska onUnknownLocation startas.
*/
	function initLocation() {

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onLocationFound, onUnknownLocation);
			return;
		}
	}
/*
* Funktionen skapar en LatLng med användarens position.
* Kartan ska visa cental punkten av användarens position.
* Ett klick-event skapas på kartan och newMarker startas.
*/
	function onLocationFound(position) {	

		var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		smallMap.setCenter(location);

		google.maps.event.addListener(smallMap, 'click', newMarker);
		
	}
/*
* Funktionen skapar en LatLng med defaultvärderna.
* Kartan ska visa cental punkten av defaultvärderna.
* Ett klick-event skapas på kartan och newMarker startas.
*/
	function onUnknownLocation() {	

		var location = new google.maps.LatLng(DEFAULT_LOCATION_LAT, DEFAULT_LOCATION_LNG);
			
		smallMap.setCenter(location);

		google.maps.event.addListener(smallMap, 'click', newMarker);
		
	}
/*
* Funktionen tar emot klick-eventet.
* placeMarker startas och skickar med klick-eventets latitude och longitude.
* Klick-eventets latitude och longitude ska skrivas ut i latitude- och longitude-fälten.
*/
	function newMarker(event) {	

		placeMarker(event.latLng);


//ADDRESS TO LAT LNG
		var geocoder = new google.maps.Geocoder();
		var address = "new york";

		geocoder.geocode( { 'address': address}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
		   var latitude = results[0].geometry.location.lat();
			var longitude = results[0].geometry.location.lng();
		    alert(latitude);
    
		  } 
		}); 

		 document.getElementById("lat").value = event.latLng.lat();
         document.getElementById("lng").value = event.latLng.lng();
	}
/*
* Funktionen tar emot positionen.
* deleteOverlays startas.
* En ny marker skapas med nya värden.
* Positionen ska var positionen som kommer ifrån klick-eventet. 
* Markern ska läggas på den lilla kartan.
* Man ska inte kunna dra markern.
* Animationen ska vara drop.
* Den nya markerns ska läggas in i markersArray.
*/
	function placeMarker(location) {

            deleteOverlays();

           	var options				= new Object();
           		options.position 	= location;
           		options.map 		= smallMap;
           		options.draggable	= false;
				options.animation	= google.maps.Animation.DROP;


           var marker = new google.maps.Marker(options);

            markersArray.push(marker);

        }
/*
* Funktionen kollar fall det finns några makers i markersArray.
* Om det finns markers ska alla markers sättas till null.
* markersArray sätts till 0.
*/
    function deleteOverlays() {
    	
           if (markersArray) {

             for (i in markersArray) {

                 markersArray[i].setMap(null);
              
             	}

            markersArray.length = 0;

            }
        }  
init();   
}//End Class 
