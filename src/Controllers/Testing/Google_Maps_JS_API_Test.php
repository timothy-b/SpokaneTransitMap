<!--
  https://developers.google.com/maps/documentation/javascript/tutorial
 -->

<!DOCTYPE html>
<html>
<head>

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

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>


<script>
    $(document).ready(function(){
        var data = {
            url: '../loadGMapsJs.php',
            type: 'GET',
            dataType: "script",
            data: {callback:'initMap'}
        };
        $.ajax(data);
    });
</script>

</body>

</html>