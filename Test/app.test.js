var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('Test/test.json')
server.use(router)

server.listen(3001, function () {

})

var assert = require('assert')
var app = require('../public/js/app')
describe('Supplier App',function() {
	describe('Labels',function() {
		it('Labels should be object',function() {
			assert.equal('object',typeof(app.Labels))
		})
		it('Labels.get() should return empty array - no data yet',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([],app.Labels.get())
				done();
			})
		})
		it('Labels.create("Test") should return true',function(done) {
			assert.equal(true,app.Labels.create('Test',function(Obj) {
				app.Labels.callBackSave(Obj)
				done();
			}))
		})
		it('Labels.create("Test") should return false - duplicate entry',function() {
			assert.equal(false,app.Labels.create('Test'))
		})
		it('Labels.get() should return one entry with value "test"',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"test"],app.Labels.get())
				done()
			})
		})
		it('Labels.update(1,"tests") should return true',function(done) {
			assert.equal(true,app.Labels.update(1,'tests',function(Obj) {
				app.Labels.callBackSave(Obj)
			}))
			done();
		})
		it('Labels.get() should return one entry with value "tests"',function(done) {
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"tests"],app.Labels.get())
				done()
			})
		})		
		it('Labels.delete(1) should delete "tests" label',function(done) {
			app.Labels.delete(1)
			assert.deepEqual([],app.Labels.get([1]))
			done()
		})
		it('Calling Labels.create() multiple times, all should return true',function() {
			assert.equal(true,app.Labels.create('Test'))
			assert.equal(true,app.Labels.create('Test1'))
			assert.equal(true,app.Labels.create('Test2'))
			assert.equal(true,app.Labels.create('Test3'))
			assert.equal(true,app.Labels.create('Test4'))
		})
		it('Labels.get() should return entries with values ["test","test1","test2","test3","test4"]',function(done) {
			Hold = true
			app.Labels.read(function(Obj) {
				app.Labels.populate(Obj)
				assert.deepEqual([,"test","test1","test2","test3","test4"],app.Labels.get())
				assert.deepEqual(["test3","test4"],app.Labels.get([4,5]))
				done()
			})
		})
		it('Labels.delete() multiple times until empty',function(done) {
			app.Labels.delete(1)
			app.Labels.delete(2)
			app.Labels.delete(3)
			app.Labels.delete(4)
			app.Labels.delete(5) 
			
			setTimeout(function() { 
				// Ugly hack but wait until XHR of delete is completed
				app.Labels.Data = {}
				app.Labels.List = []
				done() 
			},10)


			assert.deepEqual([],app.Labels.get())
		})
	})
	describe('Suppliers',function() {
		it('Suppliers should be an object ',function() {
			assert.equal('object',typeof(app.Suppliers))
		}) 
		it('Suppliers.get() should return empty array - No data',function(done) {
			app.Suppliers.read(function(Obj) {
				app.Suppliers.populate(Obj)
				assert.deepEqual([],app.Suppliers.get())
				done()
			})
		})
		it('Supplier.create()',function(done) {
			var isSaved = app.Suppliers.create({name:"test",address:"test"},function(Obj) {
				app.Suppliers.callBackSave(Obj)
				testData =  [,{name:'test',address:'test',id:1}]
				assert.deepEqual(testData,app.Suppliers.get())
				done()
			})
			assert(true,isSaved)
		}) 
		it('Suppliers.delete() first test insert',function(done) {
			app.Suppliers.delete(1)
			setTimeout(function() { 
				// Ugly hack but wait until XHR of delete is completed
				done() 
			},5)
		})
		it('Suppliers.create() with a label',function(done) {
			app.Labels.create("testCase",function(Obj) {
				app.Labels.callBackSave(Obj)
				var data = {name:'test',Labels:[1]}
				app.Suppliers.create(data,function(Obj) {
					app.Suppliers.callBackSave(Obj)
					done()
				})	
			})
		})
		it('Delete Label - testing for removeLabelFromSupplier',function(done) {
			app.Labels.delete(1)
			setTimeout(function() { 
				// Ugly hack but wait until XHR of delete is completed			
				done() 
			},5)			
		})
		it('Check if label is removed from Supplier',function(done) {
			testData =  [,{name:'test',Labels:[],id:1}]
			assert.deepEqual(testData,app.Suppliers.get())
			app.Suppliers.delete(1)
			setTimeout(function() { 
				// Ugly hack but wait until XHR of delete is completed
				done() 
			},5)			
		})
	})

}) 	