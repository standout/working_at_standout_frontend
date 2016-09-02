require('jsdom-global')()
var expect = require("chai").expect;
var suppliers = require("../app.js");

describe("test", function () {
    it('should return -1 when the value is not present', function() {
      var test = expect(-1, [1,2,3].indexOf(4));
	  console.log(test);
    });
});

describe("suppliers", function () {
    it('should show all suppliers', function (done) {
		console.log(suppliers);
		done();
	});
});

	