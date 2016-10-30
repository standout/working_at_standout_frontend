/*
* Marker är en dynamisk klass.
* Marker tar emot alla värderna för inläggen.
*/
function Marker(theID, theName, theAddress, thePostcode, theCity, thePhone, theEmail, theCategory, theLat, theLng) {
/*
* Globala variabler.
*/
self = this;

this.marker 	= null;
this.infowindow = null;

this.theID 			= theID;
this.theName 		= theName;
this.theAddress 	= theAddress;
this.thePostcode 	= thePostcode;
this.theCity 		= theCity;
this.thePhone 		= thePhone;
this.theEmail 		= theEmail;
this.theCategory	= theCategory;
this.theLat 		= theLat;
this.theLng 		= theLng;
/*
* init är klassens konstruktor.
* initMarker startas.
*/
	function init() {

		initMarker();
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
	function initMarker() {	

		var position = new google.maps.LatLng(self.theLat, self.theLng);

		var optionsMarker			= new Object();
			optionsMarker.name	 	= self.theID;
			optionsMarker.map		= Main.map;
			optionsMarker.draggable	= false;
			optionsMarker.animation	= google.maps.Animation.DROP;
			optionsMarker.position	= position;
			
		self.marker = new google.maps.Marker(optionsMarker);

		var contentString = '<div id="name">' 		+ self.theName + 		'</div>' + 
							'<div id="category">' 	+ self.theCategory + 	'</div>' + 
							'<div id="address">' 	+ self.theAddress + 	'</div>' + 
							'<div id="postcode">' 	+ self.thePostcode + 	'</div>' + 
							'<div id="city">' 		+ self.theCity + 		'</div>' + 
							'<div id="phone">' 		+ self.thePhone + 		'</div>' + 
							'<div id="email">'		+ self.theEmail + 		'</div>';

		var optionsWindow			= new Object();
			optionsWindow.content 	= contentString;

		self.marker.info = new google.maps.InfoWindow(optionsWindow);


		google.maps.event.addListener(self.marker, 'click', toggleInfoWindow);
	
	}
/*
* Funktionen tar emot klick-eventet.
* Om inforutan redan är öppnad så ska inforutan stängas.
* Annars ska inforutan öppnas.
*/		
	function toggleInfoWindow(event) {

		if(this.info.opened) {
			
			this.info.close();
			this.info.opened = false;
		
		} else {

			this.info.open(Main.map, this);
			this.info.opened = true;
		}
	}
/*
* init startas.
*/
init();
}

