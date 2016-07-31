$(document).ready(function ()
{
		$("#nameButtonID").click(sendNameData).click(hideForms);
		$("#numberButtonID").click(sendNameData).click(hideForms);
		
});

function sendNumberData()
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

function sendNameData()
{
	name = $('#stopNumberID').attr('name');
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
