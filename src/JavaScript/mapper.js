var map;
var markers = [];

function initMap()
{
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.492512, lng: -117.58387500000003},
		zoom: 14
	});
}

$(document).ready(function() {
	$("#butHideMarkers").click(hideMarkers);
	$("#butShowMarkers").click(showMarkers);
	$("#butShowMarkersByID").click(showRoutesByRouteID);
	$.get("https://transit.land/api/v1/stops.geojson?served_by=o-c2kx-spokanetransitauthority", parseData);
});

function addStop(stopName, latLng, stops)
{
	var marker = new google.maps.Marker({
		position: latLng,
		map:map,
		title: stopName,
		icon: "./bus.png",
		route_numbers: stops,
	});
	markers.push(marker);
	marker.addListener('click', markerClicked);
}

function showRoutesByRouteID(id)
{
	for (var i = 0; i < markers.length; i++)
	{
		if(markers[i].route_numbers.includes($("#route_id").val()))
			markers[i].setMap(map);
	}
}

function showMarkers(id)
{
	for (var i = 0; i < markers.length; i++)
	{
		markers[i].setMap(map);
	}
}

function parseData(json)
{
	var data = json.features;
	for(var x = 0; x < data.length; x++)
	{
		var name = data[x].properties.name;
		var latLng = new google.maps.LatLng(data[x].geometry.coordinates[1], data[x].geometry.coordinates[0]);
		var stops = [];
		for(var y = 0; y < data[x].properties.routes_serving_stop.length; y++)
		{
			stops.push(data[x].properties.routes_serving_stop[y]);
		}
		addStop(name,latLng,stops);
	}
}

function hideMarkers()
{
	for (var i = 0; i < markers.length; i++)
	{
		markers[i].setMap(null);
	}
}

function markerClicked()
{
	var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + "<br>" + this.getPosition().lng() + "<br>"});
	infowindow.open(map,this);
}