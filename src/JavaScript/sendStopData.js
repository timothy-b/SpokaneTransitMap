$(document).ready(function ()
{
		$("#nameButtonID").click(sendNameData).click(hideForms);
		$("#nameButtonID").click(sendNameData).click(hideForms);
		
});

function sendNameData()
{
	id = $('#stopNameID').attr('id');
	data = 
	{
		url: './getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {id: id}
	}
	console.log(data);
	$.ajax(data);
}

function sendNumberData()
{
	name = $('#stopNumberID').attr('id');
	data = 
	{
		url: './getCoordsFromInput.php',
		type: 'get',
		dataType: "json",
		data: {name: name}
	}
	console.log(data);
	$.ajax(data);
}

function hideForms()
{
	$(".form").hide().slideUp();
	$("p").hide().slideUp();
}
