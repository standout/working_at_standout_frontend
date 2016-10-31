/*
* Marker is a dynamic-class
*
* @param theId - the id
* @param theName - the name
* @param theAddress - the streetname
* @param thePostcode - the postcode
* @param theCity - the city
* @param thePhone - the phonenumber
* @param theEmail - the email
* @param theCategory - the category
* @param theLat - the latitude
* @param theLng - the longitude
*/
function Marker(theID, theName, theAddress, thePostcode, theCity, thePhone, theEmail, theCategory, theLat, theLng) {
/*
* Global.
*/
self = this;

self.marker 	= null;
self.infowindow = null;

self.theID 			= theID;
self.theName 		= theName;
self.theAddress 	= theAddress;
self.thePostcode 	= thePostcode;
self.theCity 		= theCity;
self.thePhone 		= thePhone;
self.theEmail 		= theEmail;
self.theCategory	= theCategory;
self.theLat 		= theLat;
self.theLng 		= theLng;
/*
* The Constructor
* 
*/
	function init() {

		initMarker();
	}
/*
* Places a marker on the map with the right content
* 
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
* If the infowindow is closed/opened then open/close
* 
* @param event - the clickevent of the marker
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
* Start Constructor 
*/
init();
}

