<?php
/*
* Php-filen ska spara om användaren skriver ett nytt blogginlägg.
* En nu koppling till databasen skapas.
* Om kopplingen inte fungerar så kommer ett felmeddelande skrivas ut.
* Det som ligger i POST är värdet som ligger i formuläret.
*/
$mysqli = new mysqli("localhost", "ab223du", "Z6dABPhk", "ab223du");

if (mysqli_connect_errno()) {
    echo 'FUNKAR INTE';
    exit();
}
$title = $_POST['title'];
$text = $_POST['text'];
$lat = $_POST['lat'];
$lng = $_POST['lng'];
/*
* POST-parametern exit kommer in så ska man gå tillbaka till indexAdmin.php.
* Detta kollar fall användaren har klickat på avbryt-knappen.
*/
if (!empty($_POST['exit'])) {

	header('Location: ../indexAdmin.php');

	return;
}
/*
* Frågan sätter in alla värdern i Blog. 
* Sedan ska man skickas tillbaka till indexAdmin.php.
*/
$mysqli->query("INSERT INTO Blog (title, text, lat, lng) VALUES ('$title','$text','$lat','$lng');");

header('Location: ../indexAdmin.php');
/*
* Databas uppkopplingen stängs. 
*/
$mysqli->close();
?>