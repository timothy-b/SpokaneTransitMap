$(document).ready(function ()
{
	var options = {types: ['establishment']};
	var input = document.getElementById('idStopName');
	
	autocomplete = new google.maps.places.Autocomplete(input, options);
	$("#btnStopInformation").click(sendNameData);
});

var input = document.getElementById('searchTextField');

function sendNameData(event)
{
	event.preventDefault();
	var name = $("#idStopName").val();
	var radius = $("#idStopRadius").val();
	var dateTime = $("#idStopTime").val();
	var data =
	{
		url: '../Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: 
		{
			identifier: name,
			dateTime: dateTime,
			radius: radius
		},
		success: onQuerySuccess
	};
	console.log(data);
	$.ajax(data);
}

function onQuerySuccess(result){
	console.log(JSON.stringify(result, null, '\t'));
	$("#divResults").html("").append(JSON.stringify(result, null,'&emsp;'));
	$("divFormInput").slideUp();
}


