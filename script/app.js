// Network request methods

function request(method, url, optionalJson) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = resolve;
		xhr.onerror = reject;
		if (optionalJson) {
			xhr.setRequestHeader("Content-type", "application/json");
			optionalJson = JSON.stringify(optionalJson);
		}
		xhr.send(optionalJson);
	});
}

function requestJSON(url) {
	return request('GET', url)
		.then(function (e) {
			return JSON.parse(e.target.response);
		});
}

function postSupplier(supplier) {
	request('POST', 'http://localhost:3000/suppliers', supplier);
}

function putSupplier(supplier) {
	request('PUT', 'http://localhost:3000/suppliers/' + supplier.id, supplier);
}

function requestSuppliers() {
	return requestJSON('http://localhost:3000/suppliers');
}

var initMap;
var waitForMapsApi = new Promise(function (resolve) {
	initMap = resolve;
});

var mapsApiLoaded = waitForMapsApi
	.then(function () {
		return new Promise(function (resolve) {
			resolve(new google.maps.Map(document.getElementById('map'), {
				center: { lat: 56.88, lng: 14.76 },
				zoom: 11,
				mapTypeId: 'terrain'
			}));
		});

	});
