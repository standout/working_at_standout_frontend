/* Objects */

/* Labels Object */
Labels = {
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
			data = new Data(Opts)
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
		data = new Data(Opts)
		data.read()
	},
	update: function(id,label) {
		label = label.toLowerCase()
		if (this.Data[id] === undefined) {
			return false
		}
		if (this.List.indexOf(label) === -1) {
			this.Data[id].update({name:label})
			this.Data[id].callBack = function () {}
			return this.Data[id].save()
		} else {
			return false
		}
	},
	delete: function(id) {
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].delete()
		delete this.Data[id]
		delete this.List[id]
	},
	populate : function(Obj) {
		var Rsp = Obj.Response
		for (key in Rsp) {
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

/* Data Object */
/* Data object 
 * @param {object}
 * @return none
 */
function Data(Obj) {
	this.Data = Obj.Data
	this.Parent = Obj.Parent
	this.callBack = Obj.callBack
	this.id = Obj.id || false
	this.read = function() {
		let Opts = {
			url : '/'+this.Parent.name,
			method: 'GET',
			callBack: this.callBack
		}
		this.xhr(Opts)		
	}
	this.update = function (data) {
		this.Data = data
	}
	this.delete = function() {
		this.Data = undefined
		this.save()
	}
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
			Opts.callBack = function() {}
		}
		if (Opts.method === undefined) {
			return false
		}
		this.xhr(Opts)
		return true;
	}
	this.xhr = function(Opts) {
		Parent = this
		var xhr = new XMLHttpRequest();
		xhr.open(Opts.method, Opts.url);
		xhr.setRequestHeader('Content-Type', 'application/json');
    	xhr.onprogress = function () {
        	// IE must die
    	}		
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status <= 299) {
				Rsp = JSON.parse(xhr.responseText)
				Opts.callBack({Response: Rsp ,Data: Parent})
			}
		}
		xhr.send(JSON.stringify(Opts.body))
	}
}



/* Functions - DRY */

/* Get data from list 
 * @param {array} id's
 * @return {array} Array of Labels
 */  
function getData(index) {
	var rtn = []
	if (index == undefined) {
		return this.List
	}
	if (typeof(index) === 'object') {
		for (i = 0; i < index.length; i++) {
			if (index[i] !== null && !isNaN(parseInt(index[i]))) {
				if (this.List[index[i]] !== undefined) {
					var label = this.List[index[i]]
					if (label !== undefined) {
						rtn.push(label)
					}
				}
			}
		}
	}
	return rtn
}
