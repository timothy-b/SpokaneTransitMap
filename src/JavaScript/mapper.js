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
	$("#butShowMarkersByID").click(showByIdClicked);
	$.get("https://transit.land/api/v1/stops?lat=47.492512&lon=-117.58387500000003&r=1000&per_page=2500", parseData)
	//$.get("https://transit.land/api/v1/stops.json?served_by=o-c2kx-spokanetransitauthority&per_page=1000", parseData);
	//$.get("https://transit.land/api/v1/stops.geojson?served_by=o-c2kx-spokanetransitauthority", parseData);
});

function showByIdClicked()
{
	showRoutesByRouteID($("#route_id").val());
}

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
		for(var x = 0; x < markers[i].route_numbers.length; x++)
			if(markers[i].route_numbers[x][1] === id)
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
	var data = json.stops;
	for(var x = 0; x < data.length; x++)
	{
		var name = data[x].name;
		var latLng = new google.maps.LatLng(data[x].geometry.coordinates[1], data[x].geometry.coordinates[0]);
		var stops = [];
		for(var y = 0; y < data[x].routes_serving_stop.length; y++)
		{
			stops.push([data[x].routes_serving_stop[y].route_name,data[x].routes_serving_stop[y].route_onestop_id]);
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
	var str = "";
	for(var x = 0; x < this.route_numbers.length; x++)
	{
		str += this.route_numbers[x][0];
		if(x < (this.route_numbers.length - 1))
		str += ", ";
	}
	var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + " " + this.getPosition().lng() + "<br>" + str});
	infowindow.open(map,this);
}