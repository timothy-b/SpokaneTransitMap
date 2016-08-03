/**
 * @summary Handles user interaction with the forms and makes AJAX calls
 */

var mapper;
var thing = "stuff";
$(document).ready(function (){
	var options = {types: ['establishment','geocode']};
	var input = document.getElementById('idStopName');

	//var autocomplete = new google.maps.places.Autocomplete(input, options);

	mapper = Mapper.getInstance();

	$("#btnStopInformation").click(onSubmit);
	$("#butHideMarkers").click(mapper.hideMarkers);
	$("#butShowMarkers").click(mapper.showMarkers);
	$("#butShowMarkersByID").click(mapper.showRoutesByRouteId);
	$("#sel_route_id").attr("oninput", "mapper.showRoutesByRouteId()");

	console.log("ready");
});

function onSubmit(event) {
	event.preventDefault();
	console.log('onSubmit');

	var name = $("#idStopName").val();
	var data =
	{
		url: '../Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {identifier: name},
		success: onPlaceQuerySuccess
	};
	$.ajax(data);
}

function onSubmit2(event)
{
	event.preventDefault();
	if(validateDateTime() == true && validateRadius()==true/* && validateName() == true */)
	{

	}

	else if(validateDateTime() == true && validateRadius()== false/*&& validateName() == true */) {
		alert("Please enter a radius greater than 9");
	}
	
	else if(validateDateTime() == false && validateRadius() == true /* && validateName() == true */) {
		alert("Please enter a valid furute date/time combination");
	}

	/*else if(validateDateTime() == true && validateRadius() == true && validateName() == false ) {
		alert("please enter a valid location");
	}
	
	else if(validateDateTime() == false && validateRadius() == false  && validateName() == true )
	{
		alert("Please enter a valid future date/time combination and a radius greater than 9");
	}
	
	else if(validateDateTime() == false && validateRadius() == true  && validateName() == false )
	{
		alert("Please enter a valid future date/time combination and a valid location");
	} 
	else if(validateDateTime() == true && validateRadius() == false && validateName() == false ) {
		alert("Please enter a radius greater than 9 and a valid location");
	} */
	else
	{
		alert("Please enter information in the fields");
	}

}

function validateName()
{
	//display alert when name cannot be matched to place
}

function validateDateTime()
{	
		var currentDate = new Date();
		var inputDate = new Date($("#idStopTime").val());
		if(inputDate == "Invalid Date") {
			return false;
		}
		
		else if(inputDate < currentDate) {
			return false;
			}
			
		else 
		{
			return true;
		}
}


function validateRadius()
{
	if($("#idStopRadius").val() < 10)
	{
		return false;
	}
	else
	{
		return true;
	}
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
