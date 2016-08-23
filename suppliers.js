function addSupplier(name, lat, long) {
	$.post("http://localhost:3000/suppliers", {
		name: name,
		latitude: lat,
		longitude: long
	});
	showSuppliers();
}
function deleteSupplier(id) {
	$.ajax({
		url: "http://localhost:3000/suppliers/" + id,
		type: "DELETE"
	});
	showSuppliers();
}
function showSuppliers() {
	var i,
		ol = document.getElementById("suppliers-list"),
		li,
		deleteButton,
		showButton;
	while (ol.firstChild) {
    	ol.removeChild(ol.firstChild);
	}
	$.get("http://localhost:3000/suppliers", function(suppliers) {
		for (i = 0; i < suppliers.length; i++) {
			(function(){
				li = document.createElement("li");
				li.appendChild(document.createTextNode("Name: " + suppliers[i].name));
				deleteButton = document.createElement("input");
				deleteButton.setAttribute("type", "button");
				deleteButton.setAttribute("value", "Delete");
				deleteButton.setAttribute("data-id", suppliers[i].id)
				deleteButton.addEventListener("click", function () {
					deleteSupplier(this.getAttribute("data-id"));
				}, false);
				li.appendChild(deleteButton);
				showButton = document.createElement("input");
				showButton.setAttribute("type", "button");
				showButton.setAttribute("value", "Show on map");
				showButton.setAttribute("data-id", suppliers[i].id)
				showButton.addEventListener("click", function () {
					showOnMap(this.getAttribute("data-id"));
				}, false);
				li.appendChild(showButton);
				ol.appendChild(li);
			}());
		}
	});
}
function init() {
	document.getElementById("add-new-supplier").addEventListener("click", function () {
		var name = document.getElementById("new-supplier-name").value,
			lat = document.getElementById("new-supplier-lat").value,
			long = document.getElementById("new-supplier-long").value;
		addSupplier(name, lat, long);
	}, false);
	showSuppliers();
}
function showOnMap(id) {
	var map,
		lat,
		long;
	$.get("http://localhost:3000/suppliers/" + id, function(supplier) {
		lat = supplier.latitude;
		long = supplier.longitude;
		map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: lat, lng: long},
			zoom: 18
		});
	});
}
window.onload = init;