<?php
/**
 * Gets stops operated by the STA, displays on map, and allows user to filter based on route
 */

require_once('../../Credentials/doNotUpload.php');
?>

<!DOCTYPE html>
<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script src="../../JavaScript/mapper.js" async defer></script>
		<script src="../../JavaScript/formHandler.js" async defer></script>
		<script>
			$(document).ready(function(){
				var data = {
					url: '../loadGMapsJs.php',
					type: 'GET',
					dataType: "script",
					data: {callback:'mapper.initMap'}
				};
				$.ajax(data);
			});
		</script>
		<script async defer>
			$(document).ready(function(){
				loadMap();
			});

			function loadMap() {
				mapper.setPath("../");

				var name = $("#idStopName").val();
				var data =
				{
					url: '../getCoordsFromInput.php',
					type: 'get',
					dataType: "json",
					data: {identifier: "Cheney, Wa"},
					success: onPlaceQuerySuccess
				};
				$.ajax(data);
			}

		</script>
		<title>Simple Map</title>
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

		<input type="hidden" id="idStopRadius" value="50000">
		<input type="button" id="butHideMarkers" value="Hide all Markers">
		<input type="button" id="butShowMarkers" value="Show all Markers">
		<select id="sel_route_id">
			<option>loading...</option>
		</select>
		<div id="divGMap" style="height:100%;"></div>
	</body>
</html>