$("#editform").submit(function (event) {
    console.log(event.target[0].value); //Name
    console.log(event.target[1].value); //Latitude
    console.log(event.target[2].value); //Longitude
    console.log(event.target[3].value); //Category
    console.log(event.target[4].value); //Other
    event.preventDefault();
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