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
		<script src="https://maps.googleapis.com/maps/api/js?<?php echo GMAPS_JS_API_KEY ?>key=&callback=initMap" async defer></script>
		<script src="../../JavaScript/mapper.js"></script>
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
		<input type="button" id="butHideMarkers" value="Hide Markers">
		<input type="button" id="butShowMarkers" value="Show Markers">
		<select id="route_id">
			<option value="r-c2krpu-1">1</option>
			<option value="r-c2kx04-2">2</option>
			<option value="r-c2krp-20">20</option>
			<option value="r-c2krp-21">21</option>
			<option value="r-c2krr-22">22</option>
			<option value="r-c2krr-23">23</option>
			<option value="r-c2krr-24">24</option>
			<option value="r-c2kx-25">25</option>
			<option value="r-c2kx2-26">26</option>
			<option value="r-c2kx2-27">27</option>
			<option value="r-c2kx2-28">28</option>
			<option value="r-c2kx0-29">29</option>
			<option value="r-c2kx-32">32</option>
			<option value="r-c2kx2-33">33</option>
			<option value="r-c2kx1-34">34</option>
			<option value="r-c2kx0-39">39</option>
			<option value="r-c2krpf-42">42</option>
			<option value="r-c2kwb-43">29</option>
			<option value="r-c2kx0-44">44</option>
			<option value="r-c2kwb-45">45</option>
			<option value="r-c2kr-60">60</option>
			<option value="r-c2kq-62">32</option>
			<option value="r-c2kq-66">66</option>
			<option value="r-c2kqh-68">68</option>
			<option value="r-c2kx-90">90</option>
			<option value="r-c2kx-94">94</option>
			<option value="r-c2kxh-96">96</option>
			<option value="r-c2kxh-97">97</option>
			<option value="r-c2kx-98">98</option>
			<option value="r-c2kr-124">124</option>
			<option value="r-c2kq-165">165</option>
			<option value="r-c2kx-173">173</option>
			<option value="r-c2kx-174">173</option>
		</select>
		<input type="button" id="butShowMarkersByID" value="Show Markers By ID">
		<div id="map"></div>
	</body>
</html>