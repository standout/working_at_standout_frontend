/* General stuff & fluff for browser */

// I'm lazy - Do it jQuery Style! ;)
$ = document

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

	Labels.read(function(Obj) {
		Labels.populate(Obj)
	 	labels = Labels.get()
	 	for(i = 0; i < labels.length; i++){
			if (typeof(labels[i]) !== 'undefined') {
				addLabelHtml({name:labels[i],id:i})
			}
	 	}
	})


	/* All the crazy bindings */ 

	$.querySelector(".addLabel").addEventListener("click",function() {
		$form = document.querySelector('#labelForm')
		if ($form.style.display === 'inline-block') {
			$form.style.display = 'none'
		} else {
			$form.style.display = 'inline-block'
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
					console.log($.getElementById('#label-'+id))
					$.querySelector('#label-'+id).childNodes[0].nodeValue = label
				}
			}
		}
		return false;
	}) 

	/* Live for edit Label */
	live('click','#Labels .glyphicon-edit',function(event) {
		event.stopPropagation()
		event.preventDefault()
		$form = $.querySelector('#labelForm')
		Label = this.parentElement.innerText
		id = this.parentElement.id.replace('label-','')
		$form.querySelector('input').setAttribute('placeholder',Label)
		$form.querySelector('input').setAttribute('data-id',id)
		$form.querySelector('input').value = Label
		$form.querySelector('input').focus()
		$form.querySelector('label').innerHTML = 'Ändra'

		$form.style.display = 'inline-block'
	});		
	
	/* Live for delete Label */
	live('click','#Labels .glyphicon-remove',function(event) {
		event.stopPropagation()
		event.preventDefault()
		labelId = this.parentElement.id.replace('label-','')
		this.parentElement.remove()
		Labels.delete(labelId)
	});

})

/* Small sweet helper functions :) */

/* Add Label to html */
function addLabelHtml(Label) {
	placeholder = $.querySelector('#Labels')
	span = $.createElement('span');
	/* Add inne html and properties */
	span.innerHTML = Label.name
	span.className += "label label-primary no-select"
	span.id = "label-"+Label.id

	/* Add icon */
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
			}
		}
	});
}
