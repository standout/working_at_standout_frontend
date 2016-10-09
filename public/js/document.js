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
})