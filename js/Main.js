/*
* Static class that runs when the application runs.
*
* 	@author		Anna Brun
*	@email		anna.brun92@gmail.com
*	@version	2.0
*
*/
var Main = {
/*
* Global
*/
	map : null,

	DEFAULT_LOCATION_LAT : 56.8556997,
	DEFAULT_LOCATION_LNG : 14.8290924,

	markersArray : new Array,
	markersArrayCat : new Array(),
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
			options.zoom		= 6;
			options.mapTypeId	= google.maps.MapTypeId.ROADMAP;
			
		Main.map = new google.maps.Map(canvas, options);

		Main.addDataToStage(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);	
	},
/*
* Places markers of the Suppliers that are in the database via an Ajax-class.
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
			
				Main.markersArray.push(theMarker);
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

			var name 			= document.forms["add-form"]["name"].value;
			var street 			= document.forms["add-form"]["address"].value;
			var postcode 		= document.forms["add-form"]["postcode"].value;
			var city 			= document.forms["add-form"]["city"].value;
			var phone 			= document.forms["add-form"]["phone"].value;
			var email 			= document.forms["add-form"]["email"].value;
			var category 		= document.forms["add-form"]["category"].value;
			var categoryArray 	= category.split(",");
			var catJson 		= [];

			for (i in categoryArray) {

				catJson.push({name: categoryArray[i]});		
			}
         
			var address 	= street + ", " + postcode + ", " + city; 
			var geocoder 	= new google.maps.Geocoder();

			geocoder.geocode({'address': address}, function(results, status) {
	          if (status === 'OK') {
	            var latitude 	= results[0].geometry.location.lat();
                var longitude 	= results[0].geometry.location.lng();

                var data = JSON.stringify({"name":name,
						                	"address":street,
						                	"postcode":postcode,
						                	"city":city,
						                	"phone":phone,
						                	"email":email,
						                	"category": catJson,
						                	"latitude":latitude,
						                	"longitude":longitude
						                });
                var ajax = new Ajax();
				ajax.post("http://localhost:3000/suppliers/", data, Main.emptyCallback());
	           
	          } else {
	            alert('Request Failed! Is the address right?');
	            
	          }
	        });

			return false;
		 }
	},
/*
* A callback-funktion from the Ajax-class that reloads the page.
* 
*/
	emptyCallback : function() {

		location.reload();
	},
/*
* Search for suppliers in a specific category from the form in the GUI 
* 
* @return false
*/	
	searchSupplier : function() {

		document.getElementById('get-suppliers-form').onsubmit=function() {

			var category = document.forms["get-suppliers-form"]["category"].value;
			Main.updateMarkersArrayCat(category);

			if (category === "all")  return true;
			else return false;	
		  } 
	},
/*
* If a category has been search for shall those suppliers be shown and others hidden.
*
* @param category - the category to show
*/
    updateMarkersArrayCat : function(category) {
    	
       if (Main.markersArray) {

	       	Main.deleteOldMarkersArray();

	        for (i in Main.markersArray) {

	        	for (x in Main.markersArray[i].theCategory) {
	                if (Main.markersArray[i].theCategory[x].name === category) {

	                 	Main.markersArray[i].marker.setVisible(true);
	                	break;
	                } 
	                 else Main.markersArray[i].marker.setVisible(false);
	            }
         	}   
        } 
	},
/*
* Deletes all the markers in the markersArrayCat.
* 
*/
    deleteOldMarkersArray : function() {
	
       if (Main.markersArrayCat) {

         for (i in Main.markersArrayCat) {

             Main.markersArrayCat[i].setMap(null);
          
         	}

        Main.markersArrayCat.length = 0;

        }
	},
/*
* Deletes a marker from the database.
* 
*/
	deleteMarker : function(id) {

		var ajax = new Ajax();
		ajax.delete("http://localhost:3000/suppliers/" + id, Main.emptyCallback());
	} 
}
/**
 *	Constructor load.
 */
google.maps.event.addDomListener(window, 'load', Main.init); // NOTE THIS NEW EVENT LISTENER FROM GOOGLE