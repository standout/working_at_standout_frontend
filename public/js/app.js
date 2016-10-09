/* Objects */

/* Labels Object */
Labels = {
	name:'Labels',
	List: [],
	Data: {},
	create: function(label) {
		let Obj = {
			Parent: this,
			Data: {name:label.toLowerCase()},
			callBack: this.callBack
		}
		label = new Data(Obj)
		label.save()
	},
	read: function(Obj) {},
	update: function(id,label) {
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].update({name:label.toLowerCase()})
		this.Data[id].save()
	},
	delete: function(id) {
		if (this.Data[id] === undefined) {
			return false
		}
		this.Data[id].delete()
	},
	callBack: function(Obj) {
		Obj.Data.id = Obj.Response.id
		Labels.Data[Obj.Response.id] = Obj.Data
		Labels.List[Obj.Response.id] = Obj.Response.name
	}
	
}


/* Suppliers Object */

/* Functions - DRY */

/* Data object 
 * @param {object}
 * @return none
 */
function Data(Obj) {
	this.Data = Obj.Data
	this.Parent = Obj.Parent
	this.callBack = Obj.callBack
	this.id = false;
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
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status <= 299) {
				Rsp = JSON.parse(xhr.responseText)
				Opts.callBack({Response: Rsp ,Data: Parent})
				return Rsp 
			}
		}
		xhr.send(JSON.stringify(Opts.body))		
	}
}

