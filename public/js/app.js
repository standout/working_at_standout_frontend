/* Objects */

/* Labels Object */
Labels = {
	name:'Labels',
	List: [],
	create: function(label) {
		let Obj = {
			Parent: this,
			data: {name:label.toLowerCase()},
			callBack: this.callBack
		}
		label = new Data(Obj)
		label.save()
	},
	read: function(Id) {},
	update: function(Id) {},
	delete: function(Id) {},
	callBack: function(Obj) {
		console.log(Obj)
	}
	
}


/* Suppliers Object */

/* Functions - DRY */

/* Data object 
 * @param {object}
 * @return none
 */
function Data(Obj) {
	this.data = Obj.data
	this.Parent = Obj.Parent
	this.callBack = Obj.callBack
	this.id = false;
	this.save = function() {
		let Opts = {
			url : '/'+this.Parent.name,
			method: '',
			body: '',
			done: this.callBack
		}
		if (this.data !== undefined) {
			// Data isn't empty - create / update
			if (this.id === false) {
				Opts.method = 'POST'
				Opts.body = this.data
			} else {
				Opts.url += '/'+this.id
				Opts.method = 'PUT'
				Opts.body = {
					id: this.id,
					name:this.name
				}
			}
		} else if (this.data === undefined && this.id !== false) {
			// We have id and empty data, send delete
			Opts.url += '/'+this.id
			Opts.method = 'DELETE'
		}
		this.xhr(Opts)
	}
	this.xhr = function(Opts) {
	  var xhr = new XMLHttpRequest();
	  xhr.open(Opts.method, Opts.url);
	  xhr.setRequestHeader('Content-Type', 'application/json');
	  xhr.onload = function() {
	    if (xhr.status > 200 && xhr.status <= 299) {
	        Opts.done(JSON.parse(xhr.responseText))
	    }
	  }
	  xhr.send(JSON.stringify(Opts.body))		
	}
}

