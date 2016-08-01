$(document).ready(function ()
{
	//var options = {types: ['establishment']};
	//var input = document.getElementById('idStopName');
	
	//var autocomplete = new google.maps.places.Autocomplete(input, options);
	$("#btnStopInformation").click(onSubmit);
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

function onPlaceQuerySuccess(response){
	var result = response.results[0];
	console.log("got a place matching the given identifier");
	console.log(result);

	var lat = result.geometry.location.lat;
	var lng = result.geometry.location.lng;
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
	getMarkersFromStopsRequest(response)
}

function buildStopsURL (lat, lon, rad ){
	var stops_TL_API_call = "https://transit.land/api/v1/stops?lat=" +
		lat + "&lon=" + lon + "&r=" + rad;
	return stops_TL_API_call;
}
