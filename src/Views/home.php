<?php
/**
 * https://developers.google.com/maps/documentation/javascript/tutorial
 */

require_once('../Credentials/doNotUpload.php');
?>

<html>
	<head>
		<title>STA Project Stop Info</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script src="../JavaScript/mapper2.js"></script>
		<script src="../JavaScript/formHandler.js"></script>
		<script src="../../js/bootstrap.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo GMAPS_JS_API_KEY?>&callback=initMap" async defer></script>

		<meta name="viewport" content="initial-scale=1.0">
		<meta charset="utf-8">
		<style>
			html, body {
				height: 100%;
				margin: 0;
				padding: 0;
			}
			#map {
				height: 100%;
			}
		</style>

	</head>
	
	<body>

	<div id="divFormInput" class="col-md-4">

	<p>Please Enter the Stop Information</p>

	<label for="idStopName">Stop Name:</label>
	<input type="text" name="stopName" id="idStopName"><br>
	
	<label for="idStopTime">Stop Date and Time:</label>
	<input type="datetime-local" name="stopTime" id="idStopTime"><br>
	
	<label for="idStopRadius">Stop Radius:</label>
	<input type="number" name="stopRadius" id="idStopRadius"><br>
	
	<button type="button" name="btnStopInformation" id="btnStopInformation" class="button">Submit</button><br>
	
	</div>
	
	<div id="divMap" class="col-md-6"><?php include_once("../Views/map.php")?></div>

	</body>
</html>
