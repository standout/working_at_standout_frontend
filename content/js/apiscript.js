var host = window.location.hostname || "localhost";
function getLocations() {
    return $.get('http://' + host + ':3000/suppliers');
}
function addLocation(input) {
    return $.post('http://' + host + ':3000/suppliers', input);
}
function updateLocation(input) {
    return $.ajax({
        url: 'http://' + host + ':3000/suppliers/' + input.id,
        method: 'PUT',
        data: input
    });
}
function deleteLocation(id) {
    return $.ajax({
        url: 'http://' + host + ':3000/suppliers/' + id,
        method: 'DELETE'
    });
}
function getCategories() {
    return $.get('http://' + host + ':3000/categories');
}
function addCategory(input) {
    return $.post('http://' + host + ':3000/categories', input);
}
function updateCategory(input) {
    return $.ajax({
        url: 'http://' + host + ':3000/categories/' + input.id,
        method: 'PUT',
        data: input
    });
}
function deleteCategory(id) {
    return $.ajax({
        url: 'http://' + host + ':3000/categories/' + id,
        method: 'DELETE'
    });
}