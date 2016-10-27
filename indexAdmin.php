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

	        <h1>Suppliers</h1>

	        <form action="indexAdmin.php?seesuppliers=1" method="post">
	         	<input type="submit" value="See List of Suppliers" />
	        </form>

	        <form action="indexAdmin.php?addsuppliers=1" method="post">
	         	<input type="submit" value="Add Suppliers" />
	        </form>

	        </div>';
	}


 if (isset($_GET['seesuppliers']) == 1) {

        echo '	<div id="newPost-wrapper"> 

        			<h1>Suppliers:</h1>

		        	<form action="" method="post">
			        <input type="text" placeholder="Category" name="title"/><br/>
			        <input type="submit" name="exit" value="Tillbaka" />
			        </form>
			        <br/>

        		</div>';
   	}

   	if (isset($_GET['addsuppliers']) == 1) {

        echo '	<div id="newPost-wrapper"> 

        			<h1>Add Supplier</h1>

		        	<form action="" method="post">
			        <input type="text" placeholder="Name" name="name"/><br/>
			        <input type="text" placeholder="Address" name="address"/><br/>
			        <input type="text" placeholder="Postcode" name="postcode"/><br/>
			        <input type="text" placeholder="City" name="city"/><br/>
			        <input type="text" placeholder="Phonenumber" name="number"/><br/>
			        <input type="text" placeholder="Email" name="email"/><br/>
			        <input type="text" placeholder="Category" name="category"/><br/>
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