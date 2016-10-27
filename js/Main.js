/*
* Main är en statisk klass.
* Main körs när sidan laddas in.
*/
var Main = {
/*
* Globala variabler.
*/
	map : null,

	DEFAULT_LOCATION_LAT : 56.8556997,
	DEFAULT_LOCATION_LNG : 14.8290924,
/*
* Funktionen startas när Main körs.
*/
	init : function() {	
		
		Main.initMap();
		Main.getLocations();
		Main.initSmallMap();

	},
/*
* Funktionen skapar huvudkartan
* Zoomen på kartan ska ligga på 6.
* Kartan ska vara en Roadmap.
* Kartan ska ligga i map-id't.
*/	
	initMap : function() {

		var canvas				= document.getElementById('map');
		var options 			= new Object();
			options.zoom		= 5;
			options.mapTypeId	= google.maps.MapTypeId.ROADMAP;
			
		Main.map = new google.maps.Map(canvas, options);
		
	},
/*
* Funktionen skapar en liten karta till när man skriver ett nytt blogginlägg
* Om inte smallmap-id't finns så ska inte denna funktion gå vidare.
* Zoomen på den lilla kartan ska ligga på 9.
* initLocation startas.
*/
	initSmallMap : function() {

		var canvas				= document.getElementById('smallmap');
		if (canvas != null) {

			var smallMap = new AddSmallMap();

		}
	},
/*
* Funktionen skapar en ny instans av Ajax.
* Ajax går in i GetPosts och startar onDataLoaded.
*/


	getLocations : function() {	

		Main.addDataToStage(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);
	
	    var getSuppliers = new GetSuppliers();

	},
/*
* Funktionen tar emot responseData.
* responseData görs om till en text.
* Om responseData är tom ska defaultLocationFunction startas.
* Om responseData har värden loopas alla inlägg igenom och får en variabel.
* Bilden läggs in i en img-tagg.
* addDataToStage startas och skickar med lat och lng
* En ny instans av Marker skapas och skickar med alla värden. 
*
*
*
* ------------------------ERROR NÅGONSTANS!!!------------
*/
	onDataLoaded : function(responseData) {	

		responseData = responseData.responseText;

		if (!!responseData) {

			responseData = JSON.parse(responseData);

			for (var i = 0; i < responseData.length; i++) {

				var id  		= responseData[i].id;
	            var name   		= responseData[i].name;
	            var address   	= responseData[i].address;
	            var postcode   	= responseData[i].postcode;
	            var city   		= responseData[i].city;
	            var phone   	= responseData[i].phone;
	            var email   	= responseData[i].email;
	            var category   	= responseData[i].category;
	            var lat    	 	= responseData[i].latitude;
	            var lng     	= responseData[i].longitude;

				Main.addDataToStage(lat, lng);

				var theMarker = new Marker(id, name, address, postcode, city, phone, email, category, lat, lng);
				
			}
				
		} else {

			Main.defaultLocationFunction();
		}
	},
/*
* Funktionen tar emot lat och lng.
* En ny LatLng skapas med värderna av lat och lng.
* Kartan ska visa cental punkten av det sista blogginlägget.
*/
	addDataToStage : function(lat, lng) {
		
		var location = new google.maps.LatLng(lat, lng);
		Main.map.setCenter(location);
	},
/*
* Funktionen skapar en ny LatLng med defaultvärderna.
* Kartan ska visa cental punkten av defaultvärderna.
*/
	defaultLocationFunction : function() {

		var defaultLocation = new google.maps.LatLng(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);
			Main.map.setCenter(defaultLocation);
	}, 
    
}//End Class 
/**
 *	När Main laddas in ska init-funktionen skapas. 
 */
google.maps.event.addDomListener(window, 'load', Main.init); // NOTE THIS NEW EVENT LISTENER FROM GOOGLE