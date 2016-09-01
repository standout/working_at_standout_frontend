"use strict";

var App = {

	categoriesArray: ["Milk", "Bread", "Meat", "Other", "See all"],
    defaultLat: 63.0,
    defaultLong: 13.0,
	defaultZoom: 5,
	openStreetMapUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	jsonUrl: 'db.json',
	markers: [],
	map: {},

	init: function(){
		
		//Create map
        App.map = new L.Map('map', {
            center: [App.defaultLat, App.defaultLong], zoom: App.defaultZoom
        });
		
		//Create tile layer with attribution
        var osmAttribute = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.openstreetmap.org/copyright/en">CC BY-SA</a>';
        var openStreetMap = new L.TileLayer(App.openStreetMapUrl, {attribution: osmAttribute});
		
		//Set it to Sweden
        App.map.setView(new L.LatLng(App.defaultLat, App.defaultLong), App.defaultZoom);
        App.map.addLayer(openStreetMap);
						
		App.renderSuppliers();
		App.renderCategories();
		
		//If user presses the resetButton then reset application
        var resetButton = document.getElementById('reset');
        resetButton.addEventListener('click', function(){
           App.resetMap();
            App.renderSuppliers();
            //App.map.closePopup();

            //Remove all "active" classes
            $("a").each(function() {
                if (this.classList.contains('active')) {
                    this.className = "categoryLink";
                }
            });

            //Set "See all" as default value
            $("span").children().last().removeClass("categoryLink").addClass("active");
        });
	},
	
	resetMap: function(){
        App.map.setView([App.defaultLat, App.defaultLong], App.defaultZoom);
    },
	
	renderInfo: function(suppliers){
		
        var listOfSuppliersContainer = document.getElementById("listOfSuppliers");

        //If list is rendered clear it
        listOfSuppliersContainer.innerHTML = "";

        //For each message render it under category
        suppliers.forEach(function(supplier){
            var incidentText = supplier.address + "</b><br />" + supplier.phone + "<br />Kategori: " + supplier.category;

            var messageLink = document.createElement("div");
            messageLink.innerHTML = "<a href='#'>" + supplier.name + "</a>";

            var messageText = document.createElement("p");
            messageText.setAttribute("class", "supplierDetails");
            messageText.innerHTML = incidentText;

            messageLink.appendChild(messageText);
            listOfSuppliersContainer.appendChild(messageLink);

            //Hide details
            $(".supplierDetails").hide();

            //If user clicks on incident then show details
            messageLink.addEventListener('click', function(){
               App.renderDetails(this, supplier);
            });
        });
    },
	
	renderDetails: function(link, supplier){
		
        //Hide other details so only one can show
        $(".supplierDetails").hide(link);
        $(link).children().show();

        //Set view and open popup
        App.map.setView([supplier.latitude, supplier.longitude], 12);
    },
	
	renderCategories: function(){
      var div = document.getElementById('categories');
        var id = 0;
        App.categoriesArray.forEach(function(value){
            var span = document.createElement('span');
            span.setAttribute('class', 'spanClass');
            var a = document.createElement('a');
            a.href = "#";
            a.setAttribute('id', id++);
            a.setAttribute('class', 'categoryLink');
            a.innerHTML = value;
            span.appendChild(a);

            a.addEventListener('click', function(){
                $("a").each(function() {
                    if(this.classList.contains('active')){
                        this.className = "categoryLink";
                    }
                });
                a.setAttribute('class', 'active');
               App.changeValue(a.innerHTML);
            });
            div.appendChild(span);
        });

        //Set "See all" as default value
        $("span").children().last().removeClass("categoryLink").addClass("active");
    },
	
	renderSuppliers: function(value){
		
		$.get("http://localhost:3000/suppliers", function(suppliers){
			if(suppliers.length > 0){
				App.renderMarkers(App.filterResponse(suppliers, value));
				App.renderInfo(App.filterResponse(suppliers, value));
			}
			else{
				document.getElementById("noSuppliers").style.display = "block";
			}
		});
	},
	
	//Sort suppliers based on category
    filterResponse: function(messages, value){
        if(value !== undefined && value !== 'Se alla'){
            messages = jQuery.grep(messages, function(incident){
                var incidentCategory = incident.category;
                return App.categoriesArray[incidentCategory] === value;
            });
        }
        return messages;
    },
	
	renderMarkers: function(supplier){
        
		//Remove existing markers
        App.markers.forEach(function (marker) {
            App.map.removeLayer(marker);
        });

        //For each supplier
        supplier.forEach(function(info){

            //Create icon from https://github.com/coryasilva/Leaflet.ExtraMarkers
            var icon = L.ExtraMarkers.icon({
                icon: 'fa-info',
                markerColor: 'orange',
                shape: 'square',
                prefix: 'fa'
            });
			
            var marker = L.marker([info.latitude, info.longitude], {icon: icon}).addTo(App.map);
            App.markers.push(marker);

        });
    },
};

window.onload = App.init;