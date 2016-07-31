$(document).ready(function ()
{
		$("#nameButtonID").click(sendNameData).click(hideForms);
		$("#numberButtonID").click(sendNameData).click(hideForms);
		
});

function sendNumberData()
{
	//id = $('#stopNmberID').attr('id');
	var id = $("#stopNumberID").val();
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
	//name = $('#stopNameID').attr('name');
	var id = $("#stopNumberID").val();
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
