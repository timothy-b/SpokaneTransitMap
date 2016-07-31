$(document).ready(function ()
{
	$("#btnStopInformation").click(sendData);
});

function sendData(event)
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
