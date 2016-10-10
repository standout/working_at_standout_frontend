/* General stuff & fluff for browser */


/* When DOM has loaded */
document.addEventListener('DOMContentLoaded',function() {
	/* Init map */
	map = new google.maps.Map(document.getElementById('map'), {
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

})

/* Small sweet helper functions :) */
/* Add Label to html */
function addLabelHtml(Label) {
	placeholder = document.querySelector('#Labels')
	span = document.createElement('span');
	/* Add inne html and properties */
	span.innerHTML = Label.name
	span.className += "label label-primary no-select"
	span.id = "label-"+Label.id

	/* Add icon */
	icon = document.createElement('span');
	icon.className = "glyphicon glyphicon-edit"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ändra ettikett"
	span.appendChild(icon)
	/* Remove icon */
	icon = document.createElement('span');
	icon.className = "glyphicon glyphicon-remove"
	icon.setAttribute('aria-hidden','true')
	icon.title = "Ta bort ettikett"
	span.appendChild(icon) 

	// Add it to view
	placeholder.appendChild(span)
}