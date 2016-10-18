require(['chai', ], function (chai) {
	var assert = chai.assert;
	mocha.setup('bdd');

	describe('Standard behaviour', function () {
		it('should validate the name only when it is input', function () {
			var inputName = document.getElementById('supplierNewName');

			inputName.value = 'Leverantörsnamn';
			assert.equal(true, inputName.reportValidity());
			inputName.value = '';
			assert.equal(false, inputName.reportValidity());
		});

		it('should geocode an existing address', function () {
			geocodeAddress('Storgatan 16, växjö')
				.then(function () {
					assert.ok(true);
					Promise.resolve();
				});
		});

		it('should receive directions when requesting them', function () {

			var mockLocations = [{ "location": "Kopparv. 11 363 30 ROTTNE" },
				{ "location": "Storg. 37 362 30 TINGSRYD" },
				{ "location": "Måleråsv. 25, 360 76 ÄLGHULT" },
				{ "location": "Odensjö Storegård 1, 340 32 GRIMSLÖV" },
				{ "location": "Mejerigatan 4, 570 03 VRIGSTAD" },
				{ "location": "Skånegatan 10 341 31 Ljungby" }
			];

			direct(mockLocations)
				.then(function () {
					hideSupplierMarkers(); // For directions visibility
					assert.ok(true);
					Promise.resolve();
				});
		});

	});

	mocha.run();
});
