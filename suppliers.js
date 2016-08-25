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
		markerLabel = 0;
	while (ol.firstChild) {
		ol.removeChild(ol.firstChild); //clear list
	}
	$.get("http://localhost:3000/suppliers", function (suppliers) {
		if (suppliers.length > 0) {
			document.getElementById("no-suppliers").classList.add("false");
		} else {
			document.getElementById("no-suppliers").classList.remove("false");
		}
		for (i = 0; i < suppliers.length; i += 1) {
			li = document.createElement("li");
			li.appendChild(document.createTextNode(suppliers[i].name + ", " + suppliers[i].address + ", " + suppliers[i].category + " supplier "));
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
						position: results[0].geometry.location,
						label: ++markerLabel + "" //convert to string and increment
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
		deleteButton,
		select = document.getElementById("new-supplier-category"),
		option;
	while (ol.firstChild) {
		ol.removeChild(ol.firstChild);
	}
	while (select.firstChild) {
		select.removeChild(select.firstChild);
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
			option = document.createElement("option");
			option.setAttribute("value", categories[i].category);
			option.appendChild(document.createTextNode(categories[i].category));
			select.appendChild(option);
		}
	});
}
function addSupplier(name, address, category) {
	"use strict";
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
	var geocoder;
	document.getElementById("add-new-supplier").addEventListener("click", function () {
		var name = document.getElementById("new-supplier-name").value,
			address = document.getElementById("new-supplier-address").value,
			category = document.getElementById("new-supplier-category").value;
		switch ("") {
			case name:
				alert("Name is empty");
				break;
			case address:
				alert("Address is empty");
				break;
			case category:
				alert("Add a category below");
				break;
			default:
				geocoder = new google.maps.Geocoder;
				geocoder.geocode({'address': address}, function (results, status) {
					if (status === 'OK') {
						addSupplier(name, address, category);
					} else {
						alert("Address is not valid");
					}
				});
			}
	}, false);
	document.getElementById("add-new-category").addEventListener("click", function () {
		var categoryName = document.getElementById("new-category-name").value;
		if (categoryName != "") {
			addCategory(categoryName);
		} else {
			alert("Category is empty");
		}
	}, false);
	showSuppliers();
	showCategories();
}
window.onload = init;