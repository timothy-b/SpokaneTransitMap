/**
 * @summary Handles user interaction with the forms and makes AJAX calls
 */

var mapper;
$(document).ready(function ()
{
	//var options = {types: ['establishment']};
	//var input = document.getElementById('idStopName');

	//var autocomplete = new google.maps.places.Autocomplete(input, options);

	mapper = Mapper.getInstance();

	$("#btnStopInformation").click(onSubmit);
	$("#butHideMarkers").click(mapper.hideMarkers);
	$("#butShowMarkers").click(mapper.showMarkers);
	$("#butShowMarkersByID").click(mapper.showRoutesByRouteId);
	$("#sel_route_id").attr("oninput", "mapper.showRoutesByRouteId()");
});

function onSubmit(event)
{
	event.preventDefault();
	var name = $("#idStopName").val();
	var data =
	{
		url: '../Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: { identifier: name },
		success: onPlaceQuerySuccess
	};
	$.ajax(data);
}

//TODO: fix so that stops continuously load, 100 at a time
function onPlaceQuerySuccess(response){
	var result = response.results[0];
	console.log("got a place matching the given identifier:");
	console.log(result);

	var lat = result.geometry.location.lat;
	var lng = result.geometry.location.lng;

	mapper.addYouAreHereMarker(lat,lng);

	var radius = $("#idStopRadius").val();

	var data = {
		url: buildStopsURL(lat,lng,radius),
		type: 'get',
		dataType: 'json',
		success: onStopsQuerySuccess
	};

	$.ajax(data);
}

function onStopsQuerySuccess(response){
	console.log("got stops:");
	console.log(response);
	mapper.removeMarkersFromMap();
	mapper.addNewStops(response);
}

function buildStopsURL (lat, lon, rad ){
	return "https://transit.land/api/v1/stops?lat=" +
		lat + "&lon=" + lon + "&r=" + rad + "&per_page=2500";
}
