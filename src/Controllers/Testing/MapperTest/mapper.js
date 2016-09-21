var gMap;
var gMarkers = [];
var gRouteLines = [];
var gTraffic = null;

function initMap()
{
	gMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.492512, lng: -117.58387500000003},
		zoom: 14
	});
}

$(document).ready(function() {
	$("#btnHideMarkers").click(hideMarkers);
	$("#btnShowMarkers").click(showMarkers);
	$("#btnShowMarkersByID").click(showStopsById);
	$("#btnShowRoutesByID").click(showRouteLineByID);
	$("#btnRemoveRoutes").click(removeRouteLines);
	$("#btnToggleTraffic").click(toggleTraffic);
	$.get("https://transit.land/api/v1/stops.json?served_by=o-c2kx-spokanetransitauthority&per_page=2000", parseData);
});

function toggleTraffic()
{
	if(gTraffic == null)
	{
		gTraffic = new google.maps.TrafficLayer();
		gTraffic.setMap(gMap);
	}
	else
	{
		gTraffic.setMap(null);
		gTraffic = null;
	}
}

function showRouteLineByID()
{
	$.get("https://transit.land/api/v1/route_stop_patterns?traversed_by=" + $("#route_id").val(),drawRoutePolyLine);
}

function drawRoutePolyLine(json)
{
	var data = json.route_stop_patterns;
	var routeCoordinates = [];
	for(var x = 0; x < data.length; x++)
	{
		if(!data[x].is_modified)
		{
			for(var y = 0; y < data[x].geometry.coordinates.length; y++)
			{
				var coords = {lat:data[x].geometry.coordinates[y][1],lng:data[x].geometry.coordinates[y][0]};
				routeCoordinates.push(coords);
				coords = [];
			}
			var routePath = new google.maps.Polyline({
			  path: routeCoordinates,
			  geodesic: true,
			  strokeColor: '#FF0000',
			  strokeOpacity: 1.0,
			  strokeWeight: 4
			});
			routePath.setMap(gMap);
			gRouteLines.push(routePath);
			routeCoordinates = [];
		}
	}
}

function removeRouteLines()
{
	for(var x = 0; x < gRouteLines.length; x++)
	{
		gRouteLines[x].setMap(null);
	}
	gRouteLines = [];
}

function showStopsById()
{
	showStopsByRouteID($("#route_id").val());
}

function addStop(stopName, latLng, stops)
{
	var marker = new google.maps.Marker({
		position: latLng,
		map:gMap,
		title: stopName,
		icon: "./bus.png",
		route_numbers: stops,
	});
	gMarkers.push(marker);
	marker.addListener('click', markerClicked);
}

function showStopsByRouteID(id)
{
	for (var i = 0; i < gMarkers.length; i++)
	{
		for(var x = 0; x < gMarkers[i].route_numbers.length; x++)
			if(gMarkers[i].route_numbers[x][1] === id)
				gMarkers[i].setMap(gMap);
	}
}

function showMarkers(id)
{
	for (var i = 0; i < gMarkers.length; i++)
	{
		gMarkers[i].setMap(gMap);
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
	for (var i = 0; i < gMarkers.length; i++)
	{
		gMarkers[i].setMap(null);
	}
}

function markerClicked()
{
	var str = "Routes: ";
	for(var x = 0; x < this.route_numbers.length; x++)
	{
		str += this.route_numbers[x][0];
		if(x < (this.route_numbers.length - 1))
		str += ", ";
	}
	var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + " " + this.getPosition().lng() + "<br>" + str});
	infowindow.open(gMap,this);
}