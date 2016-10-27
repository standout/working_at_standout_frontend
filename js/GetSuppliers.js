/*
* Marker är en dynamisk klass.
* Marker tar emot alla värderna för inläggen.
*/
function GetSuppliers(theCategory) {
/*
* Globala variabler.
*/
self = this;

this.marker 	= null;
this.infowindow = null;

this.theCategory	= theCategory;
/*
* init är klassens konstruktor.
* initMarker startas.
*/
	function init() {

		initSuppliers();
	}
/*
* Funktionen skapar en ny marker.
* En ny LatLng skapas med lat och lng från markern.
* Markern får titeln till markens titel.
* Markern ska läggas på den stora kartan.
* Man ska inte kunna dra markern.
* Animationen ska vara drop.
* contentString skapar div-taggar för titlen, texten och bilden.
* En inforuta skapas med contentString som värden.
* Inforutan kopplas ihop med markern med info.
* Ett klick-event skapas på markern och toggleInfoWindow startas.
*/
	function initSuppliers() {	

		var url = "http://localhost:3000/suppliers/";	
	    var request = new XMLHttpRequest();
	    request.open("GET", url);
	    request.onload = function() {
	        if (request.status == 200) {
	        	
	            Main.onDataLoaded(request);
	        }
	    };
	    request.send(null);
	
	}
/*
* init startas.
*/
init();
}

