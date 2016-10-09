/* Objects */

/* Labels Object */
Labels = {
	name:'Labels',
	List: [],
	create: function(label) {
		let Obj = {
			Parent: this,
			data: {name:label.toLowerCase()}
		}
		label = new Data(Obj)
		label.save()
	},
	read: function(Id) {},
	update: function(Id) {},
	delete: function(Id) {},
	populate: function(Obj) {}
	
}


/* Suppliers Object */

/* Functions - DRY */

/* Data object */
function Data(Obj) {
	this.data = Obj.data
	this.Parent = Obj.Parent
	this.id = false;
	this.save = function() {
		console.log(this)
		let Opts = {
			url : '/'+this.Parent.name,
			method: '',
			body: '',
			done: this.completed
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
		makeRequest(Opts)
	}
	this.completed = function(rsp) {
		console.log(rsp)
	}
}

/* Makes the request to API
 * @param {object} Params for request
 * @return {string} raw json data
 */

function makeRequest(Opts) {
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
