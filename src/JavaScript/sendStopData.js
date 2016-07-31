$(document).ready(function ()
{
		$("#btnStopName").click(sendNameData).click(hideForms);
		$("#btnStopNumber").click(sendNumberData).click(hideForms);
		
});

function sendNumberData()
{
	var id = $("#idStopNumber").val();
	var data =
	{
		url: './Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {id: id}
	};
	console.log(data);
	$.ajax(data);
}

function sendNameData()
{
	var name = $("#idStopName").val();
	var data =
	{
		url: './Controllers/getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {name: name}
	};
	console.log(data);
	$.ajax(data);
}

function hideForms()
{
	$("form").hide().slideUp();
	$("p").hide().slideUp();
}