/**
 * @summary Sets up the map and handles programmatic interaction with it.
 */

var map;
var gMarkers = [];
var gRouteNameIdDict = {};
var gMarkerYou;

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

function addNewStops(json){
    addNewMarkers(json);
    showMarkers();

    addNewRouteIds(json);
    updateDropdownRouteIds();
}

//region marker methods

function addNewMarkers(json){
    if (gMarkers == null)
        gMarkers = [];
    var newMarkers = getMarkersFromStopsRequest(json);
    gMarkers = gMarkers.concat(newMarkers);
}

function addYouAreHereMarker(lat, lng){
    if (gMarkerYou != null)
        gMarkerYou.setMap(null);

    gMarkerYou = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        icon: "./you.png"
    });

    gMarkerYou.setMap(map);
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

    marker.addListener('click', onMarkerClicked);
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

function hideMarkers()
{
    for (var i = 0; i < gMarkers.length; i++)
    {
        gMarkers[i].setMap(null);
    }
}

function onMarkerClicked()
{
    var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + "<br>" + this.getPosition().lng() + "<br>"});
    infowindow.open(map,this);
}

function removeMarkersFromMap(){
    hideMarkers();
    gMarkers = null;
    gRouteNameIdDict = null;
}

function showMarkers()
{
    for (var i = 0; i < gMarkers.length; i++)
    {
        gMarkers[i].setMap(map);
    }
}

//endregion

//region routes

function addNewRouteIds(json){
    if (gRouteNameIdDict == null)
        gRouteNameIdDict = {};
    var newRouteIds = getNewRouteIds(json);
    for (var newRouteId in newRouteIds)
        gRouteNameIdDict[newRouteId] = newRouteIds[newRouteId];
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

function showRoutesByRouteId()
{
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

function updateDropdownRouteIds(){
    var $dropdown = $("#sel_route_id");
    $dropdown.html("");

    var sortableRoutes = [];
    for (var routeId in gRouteNameIdDict)
        sortableRoutes.push([routeId, gRouteNameIdDict[routeId]]);
    sortableRoutes.sort( function(a,b){return a[1].localeCompare(b[1],'kn', {numeric: true});} );

    for (var i = 0; i < sortableRoutes.length; i++)
        $dropdown.append("<option value=\""+ sortableRoutes[i][0] +"\">"+ sortableRoutes[i][1] + "</option>");
}

//endregion