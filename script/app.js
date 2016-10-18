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

function requestSuppliers() {
	return requestJSON('http://localhost:3000/suppliers');
}

function postSupplier(supplier) {
	request('POST', 'http://localhost:3000/suppliers', supplier);
}

function putSupplier(supplier) {
	request('PUT', 'http://localhost:3000/suppliers/' + supplier.id, supplier);
}

function jsonFilterSupplier(supplier) {
	var filteredJson = {
		name: supplier.name,
		location: supplier.location,
		latitude: supplier.latitude,
		longitude: supplier.longitude,
		categories: supplier.categories
	};
	if (supplier.id) { filteredJson.id = supplier.id; }
	return filteredJson;
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

function direct(locations) {
	return mapsApiLoaded
		.then(function (map) {
			var directionsService = new google.maps.DirectionsService();
			var start = 'Växjö, Skiftesvägen 33';
			return new Promise(function (resolve) {
				directionsService.route({
					origin: start,
					destination: start,
					travelMode: 'DRIVING',
					waypoints: locations,
					optimizeWaypoints: true,
					region: 'sv'
				}, function (response, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						var directionsRenderer = new google.maps.DirectionsRenderer();
						directionsRenderer.setMap(map);
						directionsRenderer.setDirections(response);
						resolve(directionsRenderer);
					}
				});
			});
		});
}

function geocodeAddress(address) {
	return mapsApiLoaded.then(function () {
		var geocoder = new google.maps.Geocoder();
		return new Promise(function (resolve, reject) {
			geocoder.geocode({ 'address': address },
				function (results, status) {
					if (status == 'OK' && results.length == 1) {
						resolve(results[0]);
					} else if (status == 'OK' && results.length >= 1) {
						reject('Flera platser hittades, var god specificera närmare');
					} else if (status == 'ZERO_RESULTS') {
						reject('Ingen plats med den beskrivningen hittades');
					} else {
						resolve(status);
					}
				});
		});
	});
}
