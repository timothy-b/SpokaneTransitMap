//temp for testing
$(document).ready(function() {
	var dt = new Date();
	var currentTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	dt.setHours(dt.getHours()+2);
	var futureTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
	var travelDate = dt.getFullYear() + "-" + (dt.getMonth()+1) + "-" + dt.getDate();
	var stopID = "s-c2kqhmf304-ewupub"
	var routeID = "r-c2kq-66";
	$.get("http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + stopID + "&origin_departure_between=00:00:00,23:59:59" + "&date=" + travelDate + "&per_page=2000",parseTimeData);
});


/*
 * next Bus Times By Stop
 * stopID, time1, time2, travelDate
 * http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=<stopID>&origin_departure_between=<currentTime>,<laterTime>&date=<travelDate>&per_page=2500
 *
 * next Bus Times By Stop And Route
 * stopID, routeID, time1, time2, travelDate
 * http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=<stopID>&route_onestop_id=<routeID>&origin_departure_between=<currentTime>,<laterTime>&date=<travelDate>&per_page=2500
 *
 * all Bus Times By Stop
 * stopID, travelDate
 * http://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=<stopID>&origin_departure_between=00:00:00,23:59:59&date=<travelDate>&per_page=2500
 *
 * all Bus Time By Stop And Route
 * routeID, stopID, travelDate
 * http://transit.land/api/v1/schedule_stop_pairs?route_onestop_id=<routeID>&origin_onestop_id=<stopID>&origin_departure_between=00:00:00,23:59:59&date=<travelDate>&per_page=2500
*/
function parseTimeData(json)
{
	data = json.schedule_stop_pairs;
	busTimes = [];
	for(var x = 0; x < data.length; x++)
	{
		var time = [data[x].route_onestop_id, data[x].origin_departure_time];
			busTimes.push(time);	
	}
	busTimes.sort();
	displayBusTimes(busTimes);
}

function displayBusTimes(busTimes)
{
	//todo link to a display for bus times
	for(var x = 0; x < busTimes.length; x++)
	{
		console.log(busTimes[x]);
	}
}