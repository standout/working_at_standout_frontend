function showSuppliers() {
	"use strict";
	var i,
		ol = document.getElementById("suppliers-list"),
		li,
		deleteButton,
		map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: 62.3875, lng: 16.325556}, //center on Sweden
			zoom: 5
		}),
		geocoder = new google.maps.Geocoder,
		marker,
		lat,
		long;
	while (ol.firstChild) {
		ol.removeChild(ol.firstChild);
	}
	$.get("http://localhost:3000/suppliers", function (suppliers) {
		for (i = 0; i < suppliers.length; i += 1) {
			(function () {
				li = document.createElement("li");
				li.appendChild(document.createTextNode("Name: " + suppliers[i].name));
				deleteButton = document.createElement("input");
				deleteButton.setAttribute("type", "button");
				deleteButton.setAttribute("value", "Delete");
				deleteButton.setAttribute("data-id", suppliers[i].id);
				deleteButton.addEventListener("click", function () {
					deleteSupplier(this.getAttribute("data-id"));
				}, false);
				li.appendChild(deleteButton);
				ol.appendChild(li);
				geocoder.geocode({'address': suppliers[i].address}, function (results, status) {
					if (status === 'OK') {
						//map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location
						});
					} else {
						alert('Geocode was not successful for the following reason: ' + status);
					}
				});
			}());
		}
	});
}
function addSupplier(name, address) {
	"use strict";
	var geocoder = new google.maps.Geocoder;
	$.post("http://localhost:3000/suppliers", {
		name: name,
		address: address
	});
	showSuppliers();
}
function deleteSupplier(id) {
	"use strict";
	$.ajax({
		url: "http://localhost:3000/suppliers/" + id,
		type: "DELETE"
	});
	showSuppliers();
}
function init() {
	"use strict";
	document.getElementById("add-new-supplier").addEventListener("click", function () {
		var name = document.getElementById("new-supplier-name").value,
			address = document.getElementById("new-supplier-address").value;
		addSupplier(name, address);
	}, false);
	showSuppliers();
}
window.onload = init;