$(document).ready(function ()
{
		$("#btnStopNameID").click(sendNameData).click(hideForms);
		$("#btnStopNumberID").click(sendNameData).click(hideForms);
		
});

function sendNumberData()
{
	var id = $("#stopNumberID").val();
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
	var name = $("#stopNameID").val();
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