var map;
var gMarkers = [];

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.492512, lng: -117.58387500000003},
        zoom: 14
    });
}

$(document).ready(function() {
    $("#butHideMarkers").click(hideMarkers);
    $("#butShowMarkers").click(showMarkers);
    $("#butShowMarkersByID").click(showRoutesByRouteID);
});

function addMarkersToMap(json){
    var markers = getMarkersFromStopsRequest(json);
    gMarkers = markers;
    showMarkers();
    console.log(gMarkers);
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
    marker.setMap(map);
    return marker;
}

function getMarkersFromStopsRequest(json)
{
    if (!json.hasOwnProperty('stops'))
        return null;

    var markers = [];

    for(var i = 0; i < json.stops.length; i++)
    {
        markers.push(buildStopMarker(json.stops[i]));
    }
    return markers;
}

function showRoutesByRouteID()
{
    console.log($("#route_id").val());
    hideMarkers();
    for (var i = 0; i < gMarkers.length; i++) {
        for (var j = 0; j < gMarkers[i].route_numbers.length; j++) {
            if (gMarkers[i].route_numbers[j].route_onestop_id.includes($("#route_id").val())) {
                console.log("found");
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