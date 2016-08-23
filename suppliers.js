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
		button;
	while (ol.firstChild) {
    	ol.removeChild(ol.firstChild);
	}
	$.get("http://localhost:3000/suppliers", function(suppliers) {
		for (i = 0; i < suppliers.length; i++) {
			(function(){
				li = document.createElement("li");
				li.appendChild(document.createTextNode("Name: " + suppliers[i].name));
				button = document.createElement("input");
				button.setAttribute("type", "button");
				button.setAttribute("value", "Delete");
				button.setAttribute("data-id", suppliers[i].id)
				button.addEventListener("click", function () {
					deleteSupplier(this.getAttribute("data-id"));
					console.log(this.getAttribute("data-id"));
				}, false);
				li.appendChild(button);
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
window.onload = init;