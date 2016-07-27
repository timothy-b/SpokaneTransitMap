<!DOCTYPE html>
<html>
<head>
    <?php require_once('../../Credentials/doNotUpload.php'); ?>

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
<div id="map"></div>
<script>
    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 47.658889, lng: -117.425},
            zoom: 11
        });
    }
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo GMAPS_JS_API_KEY; ?>&callback=initMap"
        async defer></script>
</body>
</html>