function getLocations() {
    return $.get('http://' + window.location.hostname + ':3000/suppliers');
}
function addLocation(input) {
    return $.post('http://' + window.location.hostname + ':3000/suppliers', input);
}
function updateLocation(input) {
    return $.ajax({
        url: 'http://' + window.location.hostname + ':3000/suppliers/' + input.id,
        method: 'PUT',
        data: input
    });
}
function deleteLocation(id) {
    return $.ajax({
        url: 'http://' + window.location.hostname + ':3000/suppliers/' + id,
        method: 'DELETE'
    });
}