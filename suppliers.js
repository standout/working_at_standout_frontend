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
		marker;
	while (ol.firstChild) {
		ol.removeChild(ol.firstChild); //clear list
	}
	$.get("http://localhost:3000/suppliers", function (suppliers) {
		for (i = 0; i < suppliers.length; i += 1) {
			li = document.createElement("li");
			li.appendChild(document.createTextNode("Name: " + suppliers[i].name + " " + suppliers[i].category));
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
		}
	});
}
function showCategories() {
	"use strict";
	var i,
		ol = document.getElementById("categories-list"),
		li,
		deleteButton;
	while (ol.firstChild) {
		ol.removeChild(ol.firstChild);
	}
	$.get("http://localhost:3000/categories", function (categories) {
		for (i = 0; i < categories.length; i += 1) {
			li = document.createElement("li");
			li.appendChild(document.createTextNode(categories[i].category));
			deleteButton = document.createElement("input");
			deleteButton.setAttribute("type", "button");
			deleteButton.setAttribute("value", "Delete");
			deleteButton.setAttribute("data-id", categories[i].id);
			deleteButton.addEventListener("click", function () {
				deleteCategory(this.getAttribute("data-id"));
			}, false);
			li.appendChild(deleteButton);
			ol.appendChild(li);
		}
	});
}
function addSupplier(name, address, category) {
	"use strict";
	//var geocoder = new google.maps.Geocoder;
	$.post("http://localhost:3000/suppliers", {
		name: name,
		address: address,
		category: category
	});
	showSuppliers();
}
function addCategory(category) {
	"use strict";
	$.post("http://localhost:3000/categories", {
		category: category
	});
	showCategories();
}
function deleteSupplier(id) {
	"use strict";
	$.ajax({
		url: "http://localhost:3000/suppliers/" + id,
		type: "DELETE"
	});
	showSuppliers();
}
function deleteCategory(id) {
	"use strict";
	$.ajax({
		url: "http://localhost:3000/categories/" + id,
		type: "DELETE"
	});
	showCategories();
}
function init() {
	"use strict";
	document.getElementById("add-new-supplier").addEventListener("click", function () {
		var name = document.getElementById("new-supplier-name").value,
			address = document.getElementById("new-supplier-address").value,
			category = document.getElementById("new-supplier-category").value;
		addSupplier(name, address, category);
	}, false);
	document.getElementById("add-new-category").addEventListener("click", function () {
		var categoryName = document.getElementById("new-category-name").value;
		addCategory(categoryName);
	}, false);
	showSuppliers();
	showCategories();
}
window.onload = init;