$(".editform").submit(function (event) {
    event.preventDefault();
});
function getInput() {
    var id = $("#formId").val();
    var name = $("#formName").val();
    var latitude = $("#formLatitude").val();
    var longitude = $("#formLongitude").val();
    var category = $("#formCategory").val();
    var other = $("#formOther").val();
    return {
        id: id,
        name: name,
        latitude: latitude,
        longitude: longitude,
        category: category,
        other: other
    };
}
function clearForm() {
    $("#formId").val(0);
    $("#formName").val("");
    $("#formLatitude").val("");
    $("#formLongitude").val("");
    $("#formOther").val("");
}
$("#submitAdd").click(function () {
    var input = getInput();
    addLocation(input).done(function () {
        clearForm();
        refreshData();
    });
});
$("#submitUpdate").click(function () {
    var input = getInput();
    if (input.id == 0)
        return console.log("No location selected.");
    updateLocation(input).done(function () {
        clearForm();
        refreshData();
    });
});
$("#submitDelete").click(function () {
    var id = getInput().id;
    if (id == 0)
        return console.log("No location selected.");
    deleteLocation(id).done(function () {
        clearForm();
        refreshData();
    });
});

//Checks for numbers and decimal symbol
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
        return false;

    return true;
}