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
		map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: 62.3875, lng: 16.325556}, //center on Sweden
			zoom: 5
		}),
		marker,
		lat,
		long;
	while (ol.firstChild) {
    	ol.removeChild(ol.firstChild);
	}
	$.get("http://localhost:3000/suppliers", function(suppliers) {
		for (i = 0; i < suppliers.length; i++) {
			lat = suppliers[i].latitude;
			long = suppliers[i].longitude;
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
				ol.appendChild(li);
				marker = new google.maps.Marker({
					position: {lat: lat, lng: long},
					map: map,
					title: suppliers[i].name //shown as tooltip
				});
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
window.onload = init;