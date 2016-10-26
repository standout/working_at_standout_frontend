<!doctype html>
<html lang="sv-se">
<head>
<meta charset="UTF-8">

		<link href="css/style.css" rel="stylesheet" type="text/css" media="screen" title="Default" />
		
		<script type="text/javascript" language="javascript" src="https://maps.googleapis.com/maps/api/js?sensor=true"></script>
		<script type="text/javascript" language="javascript" src="js/Ajax.js"></script>
		<script type="text/javascript" language="javascript" src="js/Marker.js"></script>
		<script type="text/javascript" language="javascript" src="js/NewPost.js"></script>
		<script type="text/javascript" language="javascript" src="js/Main.js"></script>
	
		<title>Suppliers</title>
		
	</head>
	
	<body>
<?php

if (isset($_GET['newPost']) != 1) {
		
		echo '<div id="page-wrapper">

	        <h1>Välkommen</h1>

	        <form action="indexAdmin.php?newPost=1" method="post">
	         	<input type="submit" value="Posta Inlägg" />
	        </form>

	         <form action="php/SignOut.php" method="post">
	         	<input type="submit" value="Logga ut" />
	        </form>

	        </div>';
	}


 if (isset($_GET['newPost']) == 1) {

        echo '	<div id="newPost-wrapper"> 

        			<h1>Skriv ett inlägg</h1>

		        	<form action="php/WritePost.php" method="post">
			        <input type="text" placeholder="Title" name="title"/><br/>
			        <textarea placeholder="Skriv inlägg..." name="text"></textarea><br/>
			        <div id="smallmap" name="smallmap"></div><br/>
			        <input type="text" placeholder="Latitude" name="lat" id="lat"/><br/>
			        <input type="text" placeholder="Longitude" name="lng" id="lng"/><br/>
			        <input type="submit" name="exit" value="Avbryt" />
			        <input type="submit" name="post" value="Posta Inlägg" />
			        </form>
			        <br/>

        		</div>';
   	}
?>	

		<div id="map"></div>

	</body>

</html>