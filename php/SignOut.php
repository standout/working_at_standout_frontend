<?php
/*
* Php-filen ska logga ut en användare.
* session startas.
* session töms.
* session förstörs/avslutas.
* Användaren ska skickas tillbaka till index.php.
*/
session_start();
session_unset(); 
session_destroy(); 

header('Location: ../index.php');

?>