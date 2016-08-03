<?php
/**
 *  The home page. Contains the form, the map, and all javascript references.
 */

require_once('../Credentials/doNotUpload.php');
?>

<html>
	<head>
		<title>STA Project Stop Info</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo GMAPS_JS_API_KEY?>&callback=mapper.initMap" async defer></script>
		<script src="../JavaScript/mapper3.js"></script>
		<script src="../JavaScript/formHandler2.js"></script>
		<script src="../../js/bootstrap.min.js"></script>

		<link rel="stylesheet" href="../../css/bootstrap.min.css">

		<meta name="viewport" content="initial-scale=1.0">
		<meta charset="utf-8">
		<style>
			html, body {
				height: 100%;
				margin: 0;
				padding: 0;
			}
			#divGMap {
				height: 100%;
			}
		</style>

	</head>
	
	<body>

	<div class="container-fluid">

		<div id="divFormInput" class="col-md-2">

			<h3><span class="label label-primary">Find a bus stop near...</span></h3><br>

			<input class="form-control" type="text" name="stopName" id="idStopName" placeholder="Search Places"><br>

			<input class="form-control" type="datetime-local" name="stopTime" id="idStopTime">

			<input class="form-control" type="number" name="stopRadius" id="idStopRadius" placeholder="Radius (meters)"><br>

			<button class="btn btn-default" type="button" name="btnStopInformation" id="btnStopInformation" >Submit</button><br>

		</div>

		<div id="divMap" ><?php include_once("../Views/map.php")?></div>

	</div>

	</body>
</html>
