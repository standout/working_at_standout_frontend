document.addEventListener("DOMContentLoaded", function () {
	requestSuppliers()
		.then(function (suppliers) {
			app.supplierList = suppliers;
			setupSupplierForm();
			setupDirectionsToggle();
			setupCategorySelector();
		});
});

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

function storeSupplier(supplier) {
	var method = 'POST';
	var destination = 'http://localhost:3000/suppliers';
	if (supplier.id) {
		destination += '/' + supplier.id;
		method = 'PUT';
	}
	request(method, destination, supplier);
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

function addMapMarker(supplier) {
	return mapsApiLoaded.then(function (map) {
		// Create marker on map and store reference
		supplier.marker = new google.maps.Marker({
			map: map,
			title: supplier.name,
			position: { lat: supplier.latitude, lng: supplier.longitude }
		});

		supplier.marker.addListener('click', function () {
			supplier.selected = !supplier.selected;
		});
	});
}

function clearMapMarker(oldSupplier) {
	// Clear existing marker from
	return mapsApiLoaded.then(function () {
		if (oldSupplier && oldSupplier.marker) {
			oldSupplier.marker.setMap(null);
		}
	});
}

var resolveSupplierList;
var waitForSupplierList = new Promise(function (resolve) {
	resolveSupplierList = resolve;
});

// Proxies are responsible for model realization
var app = new Proxy({}, {
	// React when the supplierList is set
	set: function (target, property, value) {
		if (property == 'supplierList') {
			// Listen to placement or removal on any numbered position
			var supplierList = interceptSupplierList([]);
			// Place suppliers
			value.forEach(function (supplier) { supplierList.push(supplier); });
			resolveSupplierList(supplierList);
		}
		return Reflect.set(target, property, supplierList);
	}
});

// React when inserting or removing suppliers
function interceptSupplierList(suppliers) {
	var supplierContainer = document.getElementById('supplierContainer');
	return new Proxy(suppliers, {
		set: function (target, property, value) {
			value.selected = false; // Set default value
			if (property >= 0) {
				if (!value.id) { // No database id
					storeSupplier(value);
				}
				if (!value.categories) { value.categories = []; }
				value = interceptSupplier(value);
				Reflect.set(target, property, value);
				clearMapMarker(target[property])
					.then(addMapMarker(value));
				supplierContainer.insertBefore(createSupplierElement(property), supplierContainer.firstChild);
			}
			return Reflect.set(target, property, value);
		},
		deleteProperty: function (target, property) {
			var supplier = target[property];

			if (supplier.id) {
				request('DELETE', 'http://localhost:3000/suppliers/' + supplier.id);
			}
			clearMapMarker(supplier);
			supplierContainer.removeChild(supplier.element);
			return Reflect.deleteProperty(target, property);
		}
	});
}

// React on supplier modification
function interceptSupplier(supplier) {
	return new Proxy(supplier, {
		set: function (target, property, value) {
			if (property == 'location') {
				geocodeAddress(value)
					.then(function (results) {
						var location = results[0].geometry.location;
						target.latitude = location.lat();
						target.longitude = location.lng();
						clearMapMarker(target[property])
							.then(addMapMarker(target));
					});
			}
			if (property == 'selected') {
				categoryAssigner(target, value);
				if (value) {
					target.element.classList.add('supplierSelected');
					target.marker.setAnimation(google.maps.Animation.BOUNCE);
				} else {
					target.element.classList.remove('supplierSelected');
					target.marker.setAnimation(null);
				}

			}
			return Reflect.set(target, property, value);
		},
		get: function (target, name, receiver) {
			if (name === 'toJSON') {
				return function () {
					return jsonFilterSupplier(target);
				};
			} else {
				return Reflect.get(target, name, receiver);
			}
		}
	});
}

// Wrappers
function createSupplierElement(property) {
	// Todo insert adjacent HTML
	var div = document.createElement('div');
	var br1 = document.createElement('br');
	var button = document.createElement('button');

	div.appendChild(br1);
	div.appendChild(button);
	button.appendChild(document.createTextNode('✖'));

	waitForSupplierList.then(function (supplierList) {
		var supplier = supplierList[property];
		var name = document.createTextNode(supplier.name);
		var location = document.createTextNode(supplier.location);

		div.insertBefore(name, br1);
		div.insertBefore(location, button);

		div.addEventListener('click', function () {
			supplier.selected = !supplier.selected; // Toggle selected state
		});

		button.addEventListener('click', function () {
			delete supplierList[property];
		});

		supplier.element = div;
	});
	return div;
}

var onceThisTime = (function () {
	var timeoutHandle;
	// Call any amount of times within time limit, only the latest will execute
	return function (callback, milliseconds) {
		clearTimeout(timeoutHandle);
		timeoutHandle = setTimeout(callback, milliseconds);
	};
})();

function setupSupplierForm() {
	var formSupplierNew = document.getElementById('supplierNew');
	var inputName = document.getElementById('supplierNewName');
	var inputLocation = document.getElementById('supplierNewLocation');
	var buttonSubmit = document.getElementById('buttonSubmit');

	var temporaryMarker;

	inputLocation.addEventListener('input', function () {
		onceThisTime(locationInputListener, 1000);
	});

	buttonSubmit.disabled = true;
	formSupplierNew.addEventListener('submit', function (event) {

		var supplierName = inputName.value;
		var location = inputLocation.value;
		var lat = temporaryMarker.position.lat();
		var lng = temporaryMarker.position.lng();

		app.supplierList.push({
			'name': supplierName,
			'location': location,
			'latitude': lat,
			'longitude': lng
		});

		temporaryMarker.setMap(null);
		formSupplierNew.reset();
		event.preventDefault();
	});

	function locationInputListener() {
		buttonSubmit.disabled = true;
		geocodeAddress(inputLocation.value)
			.then(function (result) {
				inputLocation.setCustomValidity(''); // Set as valid

				mapsApiLoaded.then(function (map) {
					if (temporaryMarker) { temporaryMarker.setMap(null); }

					//Place marker
					temporaryMarker = new google.maps.Marker({
						map: map,
						position: result.geometry.location,
						animation: google.maps.Animation.BOUNCE
					});

					map.setCenter(temporaryMarker.position);
					buttonSubmit.disabled = false;
				});
			})
			.catch(function (status) {
				inputLocation.setCustomValidity(status);
				buttonSubmit.disabled = false;
				buttonSubmit.click(); // To force validation check
				buttonSubmit.disabled = true;
			});
	}
}

function setupDirectionsToggle() {
	var directionsToggle = document.getElementById('directionsToggle');
	var directions;

	directionsToggle.addEventListener('change', function (event) {
		if (event.target.checked) {
			directions = selectedDirections();
			directions.then(function () {
				hideSupplierMarkers();
			});
		} else {
			directions.then(function (directionsRenderer) {
				directionsRenderer.setMap(null);
			});
			showSupplierMarkers();
		}
	});
}

function selectedDirections() {
	var locations = [];
	app.supplierList.forEach(function (supplier) {
		if (supplier.selected) {
			locations.push({ location: supplier.location });
		}
	});
	return direct(locations);
}

function hideSupplierMarkers() {
	app.supplierList.forEach(function (supplier) {
		supplier.marker.setMap(null);
	});
}

function showSupplierMarkers() {
	mapsApiLoaded.then(function (map) {
		app.supplierList.forEach(function (supplier) {
			supplier.marker.setMap(map);
		});
	});
}

var categorySelector;

function setupCategorySelector() {
	categorySelector = document.getElementById('categorySelector');
	categorySelector.addEventListener('change', function (event) {
		app.supplierList.forEach(function (element) {
			var index = element.categories.indexOf(event.target.value);
			if (index >= 0) {
				element.selected = true;
			} else {
				element.selected = false;
			}
		});
	});
}

function categoryAssigner(target, add) {
	var selectionValue = categorySelector.value;
	if (selectionValue == 'none') { return; }

	var categoryIndex = target.categories.indexOf(selectionValue);
	var found = categoryIndex >= 0;
	var jsonSupplier = jsonFilterSupplier(target);
	if (add && !found) {
		target.categories.push(selectionValue);
		storeSupplier(jsonSupplier);
	} else if (!add && found) {
		target.categories.splice(categoryIndex, 1);
		storeSupplier(jsonSupplier);
	}
}
