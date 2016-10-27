<?php
/*
* Php-filen ska hämta alla blogginlägg som finns i databasen.
* En ny koppling till databasen skapas.
* Om kopplingen inte fungerar så kommer ett felmeddelande skrivas ut.
*/
$mysqli = new mysqli("localhost", "ab223du", "Z6dABPhk", "ab223du");

if (mysqli_connect_errno()) {
    echo 'FUNKAR INTE';
    exit();
}
/*
* API-nyckeln sätts till en konstant.
*/	
const FLICKR_API_KEY = '63a4d38f5d351c9116a955c2a7958c79';
/*
* Frågan hämtar alla blogginlägg från Blog i databasen.
*/	
$que = "SELECT * FROM Blog;";

$blog = $mysqli->query($que);
/*
* Om man får tillbaka fler rader än 0 så ska alla resultat loppas igenom.
* Varje resultat får en variabel. 
* En sök-sträng skapas till Flickr-anropet. 
* Strängen valideras med JSON.
* Alla resultat från Flickr loopas igenom.
* output sätts till bild-url'n.
*/
if($blog->num_rows > 0) {

	mysqli_fetch_assoc($blog);
	$blogArray = array();

	foreach ($blog as $posts) {

		$id 	= $posts['id'];
		$title 	= $posts['title'];
		$text 	= $posts['text'];
		$lat 	= $posts['lat'];
		$lng 	= $posts['lng'];

		$string	 = 'https://api.flickr.com/services/rest/?method=';
		$string	.= 'flickr.photos.search';
		$string	.= '&api_key='.FLICKR_API_KEY;
		$string	.= '&lat='.$lat;
		$string	.= '&lon='.$lng;
		$string .= '&accuracy=11';
		$string .= '&per_page=1';
		$string .= '&page=1';
		$string	.= '&format=json';

		$content = @file_get_contents($string);
		$content = @str_replace('jsonFlickrApi(', '', $content);
		$content = @substr($content, 0, strlen($content) - 1 );
		$content = @json_decode($content);
		$content = @$content->photos;

		$output = '';
		$photos	= $content;
		$photos = $photos->photo;
				
		foreach ($photos as $photo) {

			$id		= &$photo->id;
			$farm	= &$photo->farm;
			$server	= &$photo->server;
			$secret	= &$photo->secret;
					
			$output .= 'http://farm'.$farm.'.staticflickr.com/'.$server.'/'.$id.'_'.$secret.'_s.jpg';
		}
/*
* Alla värden till markern läggs in i en ny array, valueArray.
* valueArray pushas in i blogArray.
* En echo läggs ut där blogArray kodas om till JSON.
*/
		$valueArray = array($id, $title, $text, $lat, $lng, $output);

		array_push($blogArray, $valueArray);
	}

	echo json_encode($blogArray);
}
/*
* Databas uppkopplingen stängs. 
*/
$mysqli->close();	
?>