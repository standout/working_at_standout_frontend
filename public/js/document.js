/* General stuff & fluff for browser */

// I'm lazy - Do it jQuery Style! ;)
var $ = document

// Predefined vars
var currSelectedLabel = []

// Needed to get lat long from address
var geocoder = new google.maps.Geocoder();

/* When DOM has loaded */
$.addEventListener('DOMContentLoaded',function() {
	/* Init map */
	map = new google.maps.Map($.getElementById('map'), {
		center: {lat: 56.878510, lng: 14.803956},
		zoom: 14,
		mapTypeControl: 'terrain',
		zoomControl: true,
		streetViewControl: false
	});

	// Start load Labels, Suppliers has dependencies to Labels
	Labels.read(function(Obj) {
		Labels.populate(Obj)
	 	labels = Labels.get()
	 	for(i = 0; i < labels.length; i++){
			if (typeof(labels[i]) !== 'undefined') {
				addLabelHtml({name:labels[i],id:i})
			}
	 	}
	 	Suppliers.read(function(Obj) {
			Suppliers.populate(Obj)
	 		suppliers = Suppliers.get()
	 		for(i = 0; i < suppliers.length; i++){
	 			if (typeof(suppliers[i]) !== 'undefined') {
	 				addSupplierHtml(suppliers[i])
	 			}
	 		}
		})	
	})
	/* All the crazy bindings */ 

	/* Show add label form */
	$.querySelector(".addLabel").addEventListener("click",function() {
		$form = document.querySelector('#labelForm')
		$form.reset()
		if ($form.style.display === 'inline-block') {
			$form.style.display = 'none'
			this.className = this.className.replace('glyphicon-minus','glyphicon-plus')
		} else {
			$form.style.display = 'inline-block'
			this.className = this.className.replace('glyphicon-plus','glyphicon-minus')
		}
	})

	/* Show add supplier form */ 
	$.querySelector(".addSupplier").addEventListener("click",function() {
		$form = document.querySelector('#supplierForm')
		$form.reset()
		$selected = $.querySelectorAll('#Labels .label:not(#label-all)')
		if ($form.style.display === 'inline-block') {
			$form.style.display = 'none'
			this.className = this.className.replace('glyphicon-minus','glyphicon-plus')
			$.querySelector('#Suppliers').style.display='table'
			$.querySelector('#label-all').style.display='inline-block'
			
			// Remove all selected Labels
			for (key in $selected) {
				if (typeof($selected[key]) === 'object') {
					$selected[key].className = $selected[key].className.replace('label-success','label-primary')
				}
			}
			
			restoreLabels()
		} else {
			$form.style.display = 'inline-block'
			this.className = this.className.replace('glyphicon-plus','glyphicon-minus')
			$.querySelector('#Suppliers').style.display='none'
			$.querySelector('#label-all').style.display='none'

			// Store selected Labels
			for (key in $selected) {
				if (typeof($selected[key]) === 'object') {
					if ($selected[key].className.match('label-success')) {
						currSelectedLabel.push(key)
					}
					$selected[key].className = $selected[key].className.replace('label-success','label-primary')
				}
			}
		}
	})	

	/* Add / update label save */
	$.querySelector("#labelForm > button").addEventListener("click",function(event) {
		event.preventDefault()
		event.stopPropagation()
		$form = this.parentElement
		$label = $form.querySelector('input')
		if ($label.value.length > 0)	{
			id = $label.getAttribute('data-id')
			label = $label.value
			if (id === null) {
				// Create new label
				Labels.create(label,function(Obj) {
					Labels.callBackSave(Obj)
					addLabelHtml(Obj.Response)
				})
			} else if (id > 0) {
				// Update label
				if (Labels.update(id,label)) {
					// All ok
					$.querySelector('#label-'+id).childNodes[0].nodeValue = label
					$label.removeAttribute('data-id')
				}
			}
			$form.style.display = 'none'
			$form.reset()
			$.querySelector('.addLabel').className = $.querySelector('.addLabel').className.replace('glyphicon-minus','glyphicon-plus')			
		}
		return false;
	}) 

	/* Save / Update Supplier event */
	$.querySelector("#supplierForm > button").addEventListener("click",function(event) {
		event.preventDefault()
		event.stopPropagation()
		$inputs = $.querySelectorAll("#supplierForm  input")
		$form = this.parentElement
		var InputData = {}
		for (key in $inputs) {
			if ($inputs[key].value !== undefined) {
				InputData[$inputs[key].name] = $inputs[key].value
			}
 		}
 		address = InputData.address+", "+InputData.zipcode+" "+InputData.city

 		// Get latlong for map
 		geocoder.geocode({address:address},function(results, status) {
 			if (status == google.maps.GeocoderStatus.OK) {
				InputData['LatLng'] = {
					lat: results[0].geometry.location.lat(),
					lng: results[0].geometry.location.lng()
				}
			}
			id = $form.getAttribute('data-id');

			// Loop labels
			$selected = $.querySelectorAll('#Labels .label-success:not(#label-all)')
			InputData.Labels = []
			for (key in $selected) {
				if (typeof($selected[key]) === 'object') {
					InputData.Labels.push($selected[key].getAttribute('data-id'))
				}
			}

			if (id === null) {
				Suppliers.create(InputData,function(Obj) {
					Suppliers.callBackSave(Obj)
					addSupplierHtml(Obj.Response)			
				})
			} else {
				if (Suppliers.update(id,InputData)) {
					// All ok
					$td = $.querySelectorAll('tr[data-id="'+id+'"] td[data-name]')
					for (key in $td) {
						if (typeof($td[key]) === 'object') {
							valName = $td[key].getAttribute('data-name');
							if (valName !== undefined && InputData[valName] !== undefined) {
								$td[key].innerHTML = InputData[valName]
							}
						}
					}

					$form.removeAttribute('data-id')
					restoreLabels()
				}
			}
			$form.style.display = 'none'
			$.querySelector('#Suppliers').style.display='table'

 		})
		$form.style.display = 'none'
		$.querySelector('#label-all').style.display='inline-block'
		$form.reset()
		$.querySelector('.addSupplier').className = $.querySelector('.addSupplier').className.replace('glyphicon-minus','glyphicon-plus')
 		
	})

	/* Live for edit Label */
	live('click','#Labels .glyphicon-edit',function(event) {
		event.stopImmediatePropagation();
		event.preventDefault()
		$form = $.querySelector('#labelForm')
		$.querySelector('.addLabel').className = $.querySelector('.addLabel').className.replace('glyphicon-plus','glyphicon-minus')		
		Label = this.parentElement.innerText
		id = this.parentElement.getAttribute('data-id')
		$form.querySelector('input').setAttribute('placeholder',Label)
		$form.querySelector('input').setAttribute('data-id',id)
		$form.querySelector('input').value = Label
		$form.querySelector('input').focus()
		$form.querySelector('label').innerHTML = 'Ändra'
		$form.style.display = 'inline-block'
		return false
	});	

	/* Live for edit Supplier */
	live('click','#Suppliers .glyphicon-edit',function(event) {
		event.stopImmediatePropagation();
		event.preventDefault()
		$.querySelector('#Suppliers').style.display='none'
		$form = $.querySelector('#supplierForm')
		$.querySelector('.addSupplier').className = $.querySelector('.addSupplier').className.replace('glyphicon-plus','glyphicon-minus')
		$inputs = $form.querySelectorAll('input')
		id = this.parentElement.parentElement.getAttribute('data-id')
		Supplier = Suppliers.get([id])
		$form.setAttribute('data-id',id)
		for (key in $inputs) {
			if ($inputs[key].value !== undefined) {
				elmName = $inputs[key].getAttribute('name')
				$inputs[key].value = Supplier[0][elmName]
			}

 		}
		
		$form.style.display = 'inline-block'
	});		
	
	/* Live for delete Label */
	live('click','#Labels .glyphicon-remove',function(event) {
		event.stopImmediatePropagation();
		event.preventDefault()
		labelId = this.parentElement.id.replace('label-','')
		this.parentElement.remove()
		Labels.delete(labelId)
	});

	/* Live for delete supplier */
	live('click','#Suppliers .glyphicon-remove',function(event) {
		event.stopImmediatePropagation();

		event.preventDefault()
		supplierId = this.parentElement.parentElement.getAttribute('data-id')
		this.parentElement.parentElement.remove()
		Suppliers.delete(supplierId)
	});

	/* Label all label click*/
	live('click','#label-all',function(event) {
		currClass = this.className.replace(/ label/g,'');
		
		$selected = $.querySelectorAll('#Labels .label-success:not(#label-all)')
		if (currClass === 'label-primary' ) {
			this.className = this.className.replace('label-primary','label-success')
			for (key in $selected) {
				if (typeof($selected[key]) === 'object') {
					$selected[key].className = $selected[key].className.replace('label-success','label-primary')
				}
			}
		}		
	})

	/* Select Labels click event */
	live('click','#Labels .label:not(#label-all)',function(event) {
		currClass = this.className.replace(/ label/g,'');
		if (currClass === 'label-primary' ) {
			this.className = this.className.replace('label-primary','label-success')
		} else {
			this.className = this.className.replace('label-success','label-primary')
		}
		$selected = $.querySelectorAll('#Labels .label-success:not(#label-all)')
		$labelAll = $.querySelector('#label-all')
		if ($selected.length > 0) {
			$labelAll.className = $labelAll.className.replace('label-success','label-primary')
		} else {
			$labelAll.className = $labelAll.className.replace('label-primary','label-success')
		}
	});	

})

/* Small sweet helper functions :) */

/* Add Label to html */
function addLabelHtml(Label) {
	placeholder = $.querySelector('#Labels')
	span = $.createElement('span');
	/* Add inne html and properties */
	span.innerHTML = Label.name
	span.className += "label label-primary"
	span.setAttribute('data-id',Label.id)

	/* Edit icon */
	icon = $.createElement('span');
	icon.className = "glyphicon glyphicon-edit"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ändra ettikett"
	span.appendChild(icon)
	/* Remove icon */
	icon = $.createElement('span');
	icon.className = "glyphicon glyphicon-remove"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ta bort ettikett"
	span.appendChild(icon) 

	// Add it to view
	placeholder.appendChild(span)
}

/* Add supplier to table */
function addSupplierHtml(Supplier) {
	tr = $.createElement('tr')
	tr.setAttribute('data-id',Supplier.id)
	td = $.createElement('td')
	td.innerHTML = Supplier.id
	tr.appendChild(td)	
	td = $.createElement('td')
	td.setAttribute('data-name','name')
	td.innerHTML = Supplier.name
	tr.appendChild(td)
	td = $.createElement('td')
	td.setAttribute('data-name','phone')
	td.innerHTML = Supplier.phone
	tr.appendChild(td)
	td = $.createElement('td')
	td.setAttribute('data-name','labels')
	SupLabels = Labels.get(Supplier.Labels)
	for (i = 0;i<SupLabels.length;i++) {
		span = $.createElement('span');
		/* Add inne html and properties */
		id = Supplier.Labels[i]
		
		span.innerHTML = SupLabels[i]
		span.className += "label label-primary"
		span.setAttribute('data-id',id)
		td.appendChild(span)
	}

	tr.appendChild(td)
	td = $.createElement('td')
	/* Edit icon */
	icon = $.createElement('span');
	icon.className = "glyphicon glyphicon-edit"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ändra ettikett"
	td.appendChild(icon)
	/* Remove icon */
	icon = $.createElement('span');
	icon.className = "glyphicon glyphicon-remove"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ta bort ettikett"
	td.appendChild(icon) 
	tr.appendChild(td)

	tbody = $.querySelector('#Suppliers tbody')
	tbody.appendChild(tr)
}

/* function for restore previous selected Labels */
function restoreLabels() {
	for (i = 0; i < currSelectedLabel.length; i++) {
		key = currSelectedLabel[i]
		$selected[key].className = $selected[key].className.replace('label-primary','label-success')
	}
	currSelectedLabel = []
}

/* Live event handling - Thanks to http://stackoverflow.com/questions/9106329/implementing-jquerys-live-binder-with-native-javascript */
function live (eventType, elementQuerySelector, cb) {
	$.addEventListener(eventType, function (event) {
		qs = $.querySelectorAll(elementQuerySelector);
		if (qs) {
			var el = event.target, index = -1;
			while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
				el = el.parentElement;
			}
			if (index > -1) {
				cb.call(el, event);			
				return true;
			}
		}
	});
}
