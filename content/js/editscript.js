$(".editform").submit(function (event) {
    event.preventDefault();
});
function getInput() {
    return {
        id: $("#formId").val(),
        name: $("#formName").val(),
        phone: $("#formPhone").val(),
        address: $("#formAddress").val(),
        latitude: $("#formLatitude").val(),
        longitude: $("#formLongitude").val(),
        category: $("#formCategory").val(),
        other: $("#formOther").val()
    };
}
function getCatInput() {
    return {
        id: $("#formIdCat").val(),
        name: $("#formNameCat").val()
    };
}
function clearForm() {
    $("#formId").val(0);
    $("#formName").val("");
    $("#formPhone").val("");
    $("#formAddress").val("");
    $("#formLatitude").val("");
    $("#formLongitude").val("");
    $("#formOther").val("");
    $("#formIdCat").val(0);
    $("#formNameCat").val("");
}
$("#submitAdd").click(function () {
    var input = getInput();
    input.id = 0;
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

//Edit categories
$("#submitAddCat").click(function () {
    var input = getCatInput();
    input.id = 0;
    addCategory(input).done(function () {
        clearForm();
        refreshData();
    });
});
$("#submitUpdateCat").click(function () {
    var input = getCatInput();
    if (input.id == 0)
        return console.log("No location selected.");
    updateCategory(input).done(function () {
        clearForm();
        refreshData();
    });
});
$("#submitDeleteCat").click(function () {
    var id = getCatInput().id;
    if (id == 0)
        return console.log("No location selected.");
    deleteCategory(id).done(function () {
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