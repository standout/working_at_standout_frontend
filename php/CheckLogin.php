<?php
/*
* Php-filen kollat om man har skrivit in rätt uppgifter när man loggar in.
* En ny koppling till databasen skapas.
* Om kopplingen inte fungerar så kommer ett fel meddelande skrivas ut.
*/

$mysqli = new mysqli("localhost", "admin", "admin", "admin");

if (mysqli_connect_errno()) {
    echo 'FUNKAR INTE';
    exit();
	}
/*
* Det som skickas från formuläret sparas i POST och får en variabel.
*/
$email = $_POST['email'];
$password = $_POST['password'];
/*
* Alla användare hämtas ut och kollar fall email och password är samma som det som skickades med POST. 
* Frågan ställs till databasen.
*/	
$query = " SELECT * FROM admin WHERE admin.email = '$email' AND admin.password = '$password' ";
$result = $mysqli->query($query);
/*
* För att kunna starta session med rätt id så hämtas id't från databasen där emailen stämmer överrens. 
*/
$rightID = $mysqli->query("SELECT * FROM admin WHERE email='".$email."';");	
mysqli_fetch_assoc($rightID);
/*
* Loopen går igenom alla id'n som frågan har fått svar på. 
* Id't får variablen sameID.
*/
foreach($rightID as $row) {
	$sameID = $row['id'];
	}
/*
* Om Email och Password stämmer i den första frågan så kommer session att startas.
* $_SESSION["user-id"] sätts till sameID.
* Detta kommer göra att man kommer alltid att nå id't på alla sidor där session startas. 
* Om inloggningen lyckasdes ska man komma till indexAdmin.php.
* Om inloggningen misslyckades så kommer man tillbaka till index.php. 
*/
if ($result->num_rows == 1) {

	session_start();

	$_SESSION["user-id"] = $sameID;

	header('Location: ../indexAdmin.php');
}	
else {

	header('Location: ../index.php');
}
/*
* Databas uppkopplingen stängs. 
*/
$mysqli->close();
?>