$(document).ready(function ()
{
	$("#btnStopName").click(sendNameData);
});

function sendNameData(event)
{
	event.preventDefault();
	var name = $("#idStopName").val();
	var data =
	{
		url: '../Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {identifier: name},
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