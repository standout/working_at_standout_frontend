var expect = require("chai").expect;
/*var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});*/
/*describe("suppliers", function (){
	it("should work", function (){
		expect(true).to.be.true;
	});
});*/
var suppliers = require("../suppliers.js");
var jsdom = require('mocha-jsdom');
describe("get suppliers", function () {
	jsdom();
	it("should get all suppliers", function (){
		console.log(suppliers);
	});
});