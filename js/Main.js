/*
* Main is a static class.
*/
var Main = {
/*
* Global
*/
	map : null,

	DEFAULT_LOCATION_LAT : 56.8556997,
	DEFAULT_LOCATION_LNG : 14.8290924,

/*
* The Constructor.
*/
	init : function() {	
		
		Main.initMap();
		Main.getLocations();
		Main.addSupplier();
		Main.searchSupplier();

	},
/*
* Adds the map to the page.
* 
*/	
	initMap : function() {

		var canvas				= document.getElementById('map');
		var options 			= new Object();
			options.zoom		= 5;
			options.mapTypeId	= google.maps.MapTypeId.ROADMAP;
			
		Main.map = new google.maps.Map(canvas, options);
		
	},
/*
* Places markers of the Suppliers that are in the database
* via an Ajax-class.
*
*/
	getLocations : function() {	
		
		var ajax = new Ajax();
		ajax.get("http://localhost:3000/suppliers", Main.placeMarkers);

	},
/*
* The callback from the Ajax-class.
* Makes a new Marker for every Supplier found in the database
*
* @param responseData - the response from the request.
*/
	placeMarkers : function(responseData) {	

		responseData = responseData.responseText;

		Main.addDataToStage(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);

		if (!!responseData) {

			responseData = JSON.parse(responseData);

			for (var i = 0; i < responseData.length; i++) {

				var id  		= responseData[i].id;
	            var name   		= responseData[i].name;
				var address  	= responseData[i].address;
	            var postcode    = responseData[i].postcode;
	            var city     	= responseData[i].city;
	            var phone		= responseData[i].phone;
	            var email		= responseData[i].email;
	            var category	= responseData[i].category;
	            var lat			= responseData[i].latitude;
	            var lng			= responseData[i].longitude;

				var theMarker = new Marker(id, name, address, postcode, city, phone, email, category, lat, lng);
			}

		} 
	},
/*
* Sets the center for the map according to Markers or default latlng
* 
* @param lat - the latitude
* @param lng - the longitude
*/
	addDataToStage : function(lat, lng) {
		
		var location = new google.maps.LatLng(lat, lng);
		Main.map.setCenter(location);
	},
/*
* Adds a Supplier from the form in the GUI in the database
* 
* @return false
*/
	addSupplier : function() {

		document.getElementById('add-form').onsubmit=function() {

			var name 		= document.forms["add-form"]["name"].value;
			var street 		= document.forms["add-form"]["address"].value;
			var postcode 	= document.forms["add-form"]["postcode"].value;
			var city 		= document.forms["add-form"]["city"].value;
			var phone 		= document.forms["add-form"]["phone"].value;
			var email 		= document.forms["add-form"]["email"].value;
			var category 	= document.forms["add-form"]["category"].value;
			var address 	= street + ", " + postcode + ", " + city; 
			var geocoder 	= new google.maps.Geocoder();

			geocoder.geocode({'address': address}, function(results, status) {
	          if (status === 'OK') {
	            var latitude 	= results[0].geometry.location.lat();
                var longitude 	= results[0].geometry.location.lng();

                var data = JSON.stringify({"name":name,"address":street,"postcode":postcode,"city":city,"phone":phone,"email":email,"category":category,"latitude":latitude,"longitude":longitude});

                alert(data);

                var ajax = new Ajax();
				ajax.post("http://localhost:3000/suppliers", data, Main.addSupplierDone);
	           
	          } else {
	            alert('Geocode was not successful for the following reason: ' + status);
	          }
	        });

			return false;
		 }
	},
/*
* An empty callback-funktion from the addSupplier Ajax-class.
* 
*/
	addSupplierDone : function() {

		//Empty response-function
		alert("add request done");
	},
/*
* Search for suppliers in a specific category from the form in the GUI 
* 
*/	
	searchSupplier : function() {

		document.getElementById('get-suppliers-form').onsubmit=function() {

			var category = document.forms["get-suppliers-form"]["category"].value;

			alert(category);

		  } 

	},
}
/**
 *	Constructor load.
 */
google.maps.event.addDomListener(window, 'load', Main.init); // NOTE THIS NEW EVENT LISTENER FROM GOOGLE