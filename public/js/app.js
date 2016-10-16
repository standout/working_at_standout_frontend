"use strict"

// Set baseURL, by default use empty string
var baseURL = ''

/* Objects */
/* Labels Object */

var Labels = {
	name:'Labels',
	List: [],
	Data: {},
	create: function(label,Func) {
		label = label.toLowerCase()
		if (this.List.indexOf(label) === -1) {
			let Opts = {
				Parent: this,
				Data: {name:label},
				callBack: this.callBackSave,
			}
			if (typeof(Func) === 'function') {
				Opts.callBack = Func
			}
			let data = new Data(Opts)
			return data.save()
		} else {
			return false;
		}
	},
	read: function(Func) {
		let Opts = {
			Parent: this,
			callBack: this.populate
		}
		if (typeof(Func) === 'function') {
			Opts.callBack = Func
		}
		let data = new Data(Opts)
		data.read()
	},
	update: function(id,label) {
		label = label.toLowerCase()
		if (this.Data[id] === undefined) {
			return false
		}
		if (this.List.indexOf(label) === -1) {
			this.Data[id].update({name:label})
			this.Data[id].callBack = this.callBackSave
			return this.Data[id].save()
		} else {
			return false
		}
	},
	delete: function(id,Func) {
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].callBack = function() {}
		if (typeof(Func) == 'function') {
			this.Data[id].callBack = Func
		}			
		this.Data[id].delete()
		Suppliers.removeLabelFromSupplier(id)
		delete this.Data[id]
		delete this.List[id]
	},
	populate : function(Obj) {
		var Rsp = Obj.Response
		for (let key in Rsp) {
			Labels.List[Rsp[key].id] = Rsp[key].name
			let Opts = {
				id: Rsp[key].id,
				Parent: Labels,
				Data: {name:Rsp[key].name},
				callBack: Labels.callBackSave
			}
			Labels.Data[Rsp[key].id] = new Data(Opts)
		}
	},
	callBackSave: function(Obj) {
		Obj.Data.id = Obj.Response.id
		Labels.Data[Obj.Response.id] = Obj.Data
		Labels.List[Obj.Response.id] = Obj.Response.name

	},
	get: getData

}

/* Suppliers Object */
var Suppliers = {
	name:'Suppliers',
	List: [],
	Data: {},
	/* Create supplier and save it to backend
	 * @param {Object} Supplier data
	 * @param {Function} Optional - Override the default callback function
	 * @return {none}
	 */
	create: function(Obj,Func) {
		let Opts = {
			Parent: this,
			Data: Obj,
			callBack: this.callBackSave,
		}
		if (typeof(Func) === 'function') {
			Opts.callBack = Func
		}
		let data = new Data(Opts)
		return data.save()
	},
	/* Read all suppliers
	 * @param {Function} Optional - Override the default callback function
	 * @return {none}
	 */	
	read: function(Func) {
		let Opts = {
			Parent: this,
			callBack: this.populate
		}
		if (typeof(Func) === 'function') {
			Opts.callBack = Func
		}
		let data = new Data(Opts)
		data.read()
	},
	/* Update supplier
	 * @param {Number} Id of supplier
	 * @param {Object} Supplier data
	 * @param {Function} Optional - Override the default callback function
	 * @return {none}
	 */		
	update: function(id,Obj,Func) { 
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].callBack = this.callBackSave		
		if(typeof(Func) === 'function') {
			this.Data[id].callBack = Func
		}
		this.Data[id].update(Obj)
		this.Data[id].save()
	},
	/* Delete supplier
	 * @param {number} The supplier id
	 * @param {function} Optional callback
	 * @return {none}
	 */
	delete: function(id,Func) {
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].callBack = function() {}
		if (typeof(Func) == 'function') {
			this.Data[id].callBack = Func
		}
		this.Data[id].delete()
		delete this.Data[id]
		delete this.List[id]
	},
	/* Removes a label from all suppliers
	 * @param {Number} The label id
	 * @return {none}
	 */
	removeLabelFromSupplier: function(labelId) {
		for (let s = 0; s < Suppliers.List.length; s++) {
			if (Suppliers.List[s] !== undefined) {
				let Supplier = Suppliers.List[s]
				let haveLabel = Supplier['Labels'].indexOf(labelId)
				if (haveLabel > -1 ) {
					Supplier.Labels.splice(haveLabel,1)
					Suppliers.update(Supplier['id'],Supplier)
				}
			}
		}
	},
	/* Populate the suppliers data from backend to this object
	 * @param {Object} response object from XHR
	 */
	populate : function(Obj) {
		let Rsp = Obj.Response
		for (let key in Rsp) {
			Suppliers.List[Rsp[key].id] = Rsp[key]
			let Opts = {
				id: Rsp[key].id,
				Parent: Suppliers,
				Data: Rsp[key],
				callBack: Labels.callBackSave
			}
			Suppliers.Data[Rsp[key].id] = new Data(Opts)
		}
	},
	/* Default save action for Suppliers 
	 * @param {Object} response object from XHR
	 * @return {None}
	 */
	callBackSave: function(Obj) {
		Obj.Data.id = Obj.Response.id
		Suppliers.Data[Obj.Response.id] = Obj.Data
		Suppliers.List[Obj.Response.id] = Obj.Response
	},
	get: getData
	
}


/* Data Object */
/* Data object 
 * @param {object}
 * @return none
 */
function Data(Obj) {
	// Data storage
	this.Data = Obj.Data
	// Which parent does this have
	this.Parent = Obj.Parent
	// Set the callback function for XHR
	this.callBack = Obj.callBack
	// Id of Label or Supplier
	this.id = Obj.id || false
	/* Reads data for selected data
	 * @param {none}
	 * @return {none}
	 */
	this.read = function() {
		let Opts = {
			url : '/'+this.Parent.name,
			method: 'GET',
			callBack: this.callBack
		}
		this.xhr(Opts)		
	}
	/* Updates data for selected data
	 * @param {Object} Data that is going to be XHR to backend
	 * @return {none}
	 */	
	this.update = function (data) {
		this.Data = data
	}
	/* Deletes selected data
	 * @param {none} 
	 * @return {none}
	 */		
	this.delete = function() {
		this.Data = undefined
		this.save()
	}
	/* Is for POST / PUT / DELETE operations for data before doing the actuall XHR
	 * @param {none} 
	 * @return {none}
	 */		
	this.save = function() {
		let Opts = {
			url : '/'+this.Parent.name,
			method: undefined,
			body: this.Data,
			callBack: this.callBack
		}
		if (this.Data !== undefined) {
			// Data isn't empty - create / update
			if (this.id === false) {
				Opts.method = 'POST'
				
			} else {
				Opts.url += '/'+this.id
				Opts.method = 'PUT'
				Opts.body.id = this.id
			}
		} else if (this.Data === undefined && this.id !== false) {
			// We have id and empty data, send delete
			Opts.url += '/'+this.id
			Opts.method = 'DELETE'
		}
		if (Opts.method === undefined) {
			return false
		}
		this.xhr(Opts)
		return true;
	}
	/* Do the actuall XHR
	 * @param {Object} XHR options
	 * @return {none}
	 */	
	this.xhr = function(Opts) {
		let Parent = this
		let xhr = new XMLHttpRequest();
		xhr.open(Opts.method, baseURL + Opts.url);
		xhr.setRequestHeader('Content-Type', 'application/json');
    	xhr.onprogress = function () {
        	// IE must die
    	}		
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status <= 299) {
				let Rsp = JSON.parse(xhr.responseText)

				Opts.callBack({Response: Rsp ,Data: Parent})
			}
		}
		xhr.send(JSON.stringify(Opts.body))
	}
}



/* Get data from list, used in both Suppliers and Labels
 * @param {array} id's
 * @return {array} Array of Labels
 */  
function getData(ids) {
	let rtn = []
	if (ids == undefined) {
		return this.List
	}

	if (typeof(ids) === 'object') {
		for (var i = 0; i < ids.length; i++) {
			if (ids[i] !== null && !isNaN(parseInt(ids[i]))) {
				if (this.List == undefined) {
					continue;
				}
				if (this.List[ids[i]] !== undefined) {
					let data = this.List[ids[i]]
					if (data !== undefined) {
						rtn.push(data)
					}
				}
			}
		}
	}
	return rtn
}

// For testing only, run if we don't have a document else ignore it.
if(typeof(document) === 'undefined') {
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
	module.exports = {'Labels' : Labels,'Suppliers':Suppliers}
	// Override default url
	baseURL = 'http://localhost:3001'
}