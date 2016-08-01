/**
 * @summary Sets up the map and handles programmatic interaction with it.
 */

var map;
var gMarkers = [];
var gRouteNameIdDict = {};

function initMap()
{
    map = new google.maps.Map(document.getElementById('divGMap'), {
        center: {lat: 47.492512, lng: -117.58387500000003},
        zoom: 14
    });
}

$(document).ready(function() {
    $("#butHideMarkers").click(hideMarkers);
    $("#butShowMarkers").click(showMarkers);
    $("#butShowMarkersByID").click(showRoutesByRouteId);
    $("#sel_route_id").attr("oninput","showRoutesByRouteId()");
});

function addMarkersToMap(json){
    if (gMarkers == null)
        gMarkers = [];
    var newMarkers = getMarkersFromStopsRequest(json);
    gMarkers = gMarkers.concat(newMarkers);
    showMarkers();

    if (gRouteNameIdDict == null)
        gRouteNameIdDict = {};
    var newRouteIds = getNewRouteIds(json);
    for (var newRouteId in newRouteIds)
        gRouteNameIdDict[newRouteId] = newRouteIds[newRouteId];

    updateDropdownRouteIds();
}

function removeMarkersFromMap(){
    hideMarkers();
    gMarkers = null;
    gRouteNameIdDict = null;
}

function buildStopMarker(stop)
{
    var latLng = new google.maps.LatLng(stop.geometry.coordinates[1], stop.geometry.coordinates[0]);
    var marker = new google.maps.Marker({
        position: latLng,
        title: stop.name,
        icon: "./bus.png",
        route_numbers: stop.routes_serving_stop
    });

    marker.addListener('click', markerClicked);
    return marker;
}

function getMarkersFromStopsRequest(json)
{
    if (!json.hasOwnProperty('stops')) {
        console.error('PropertyNotFoundException: stops\n in the following object:');
        console.error(json);
        return null;
    }

    var markers = [];
    for(var i = 0; i < json.stops.length; i++)
    {
        markers.push(buildStopMarker(json.stops[i]));
    }
    return markers;
}

function getNewRouteIds(json){
    var newRouteIds = {};

    for (var s = 0; s < json.stops.length; s++) {
        var stop = json.stops[s];
        for (var r = 0; r < stop.routes_serving_stop.length; r++) {
            var route = stop.routes_serving_stop[r];
            newRouteIds[route.route_onestop_id] = route.route_name;
        }
    }
    console.log(newRouteIds);
    return newRouteIds;
}

function updateDropdownRouteIds(){
    var $dropdown = $("#sel_route_id");
    $dropdown.html("");
    for (var routeId in gRouteNameIdDict)
        $dropdown.append("<option value=\""+ routeId +"\">"+ gRouteNameIdDict[routeId] + "</option>");
}

function showRoutesByRouteId()
{
    console.log($("#route_id").val());
    hideMarkers();

    var selectedId = $('#sel_route_id').find(":selected").val();

    for (var i = 0; i < gMarkers.length; i++) {
        for (var j = 0; j < gMarkers[i].route_numbers.length; j++) {
            if (gMarkers[i].route_numbers[j].route_onestop_id.includes(selectedId)) {
                gMarkers[i].setMap(map);
                break;
            }
        }
    }
}

function showMarkers()
{
    for (var i = 0; i < gMarkers.length; i++)
    {
        gMarkers[i].setMap(map);
    }
}

function hideMarkers()
{
    for (var i = 0; i < gMarkers.length; i++)
    {
        gMarkers[i].setMap(null);
    }
}

function markerClicked()
{
    var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + "<br>" + this.getPosition().lng() + "<br>"});
    infowindow.open(map,this);
}