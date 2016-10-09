/* Objects */

/* Labels Object */
Labels = {
	name:'Labels',
	List: [],
	create: function(label) {
		label = new Label(label)
		id = label.save()
		this.List[id] = label
	},
	read: function(Id) {},
	update: function(Id) {},
	delete: function(Id) {}
	
}

/* Label object */
function Label(label) {
	this.name = label.toLowerCase()
	this.id = false;
	this.save = function() {
		let Opts = {
			url : '/labels',
			method: '',
			body: '',
			done: this.completed
		}
		if (this.id === false) {
			Opts.method = 'POST'
			Opts.body = {name: this.name}
		} else {
			Opts.method = 'PUT'
			Opts.body = {
				id: this.id,
				name:this.name
			}
		}

		makeRequest(Opts)
	}
	this.completed = function(rsp) {
		console.log(rsp)
	}
}

/* Suppliers Object */

/* Functions */

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
