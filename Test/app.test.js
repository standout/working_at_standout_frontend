var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('Test/test.json')
server.use(router)

server.listen(3001, function () {
  console.log('JSON Server is running on port 3001')
})

var Hold = false

var assert = require('assert')
var app = require('../public/js/app')
describe('Supplier App',function() {
	describe('Labels',function() {
		it ('Labels should be object',function() {
			assert.equal('object',typeof(app.Labels))
		})
		it ('Labels.get() should return empty array - no data yet',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([],app.Labels.get())
				done();
			})
		})
		it ('Labels.create("Test") should return true',function(done) {
			assert.equal(true,app.Labels.create('Test',function(Obj) {
				app.Labels.callBackSave(Obj)
				done();
			}))
		})
		it ('Labels.create("Test") should return false - duplicate entry',function() {
			assert.equal(false,app.Labels.create('Test'))
		})
		it ('Labels.get() should return one entry with value "test"',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"test"],app.Labels.get())
				done()
			})
		})
		it ('Labels.update(1,"tests") should return true',function(done) {
			assert.equal(true,app.Labels.update(1,'tests',function(Obj) {
				app.Labels.callBackSave(Obj)
			}))
			done();
		})
		it ('Labels.get() should return one entry with value "tests"',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"tests"],app.Labels.get())
				done()
			})
		})		
		it ('Labels.delete(1) should delete "tests" label',function(done) {
			app.Labels.delete(1)
			assert.deepEqual([],app.Labels.get([1]))
			done()
		})
		it ('Calling Labels.create() multiple times, all should return true',function() {
			assert.equal(true,app.Labels.create('Test'))
			assert.equal(true,app.Labels.create('Test1'))
			assert.equal(true,app.Labels.create('Test2'))
			assert.equal(true,app.Labels.create('Test3'))
			assert.equal(true,app.Labels.create('Test4'))
		})
		it ('Labels.get() should return entries with values ["test","test1","test2","test3","test4"]',function(done) {
			Hold = true
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"test","test1","test2","test3","test4"],app.Labels.get())
				assert.deepEqual(["test3","test4"],app.Labels.get([4,5]))
				done()
			})
		})
		it ('Labels.delete() multiple times until empty',function(done) {
			var Finished = done

			app.Labels.delete(1)
			app.Labels.delete(2)
			app.Labels.delete(3)
			app.Labels.delete(4)
			app.Labels.delete(5) 
			
			setTimeout(function() { 
				// Ugly hack but wait until XHR of delete is completed
				done() 
			},100)


			assert.deepEqual([],app.Labels.get())
		})
	})
	describe('Suppliers',function() {
		
	})

}) 	