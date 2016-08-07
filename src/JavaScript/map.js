console.log("map.html");
var queryString = location.search;
var map;
var placeData;
var mapper = Mapper.getInstance();

$(document).ready(function(){
    if (queryString == null || queryString == "") {    //show the map
        console.log("no querystring");
        loadPlaceData();
        loadMap(47.6587802, -117.4260466);
    }

    if (queryString.includes('showAllStops=true')){
        loadPlaceData();
        loadMap(47.6587802, -117.4260466, function(){loadStops(47.6587802, -117.4260466, 40000);});

    }

    else if (queryString.includes('destination=')) { //find the stops around a destination
        var destination = $.query.get('destination');
        console.log(destination);
        $("#inputSearch").val(destination);
        getPlaceData(destination, onFirstPlaceQuerySuccess);
    }
});

function loadStops(latitude, longitude, radius){
    var data = {
        url: buildStopsURL(latitude, longitude, radius),
        type: 'get',
        dataType: 'json',
        success: onStopsQuerySuccess
    };

    $.ajax(data);
}

function onStopsQuerySuccess(response){
    console.log("got stops:");
    console.log(response);

    mapper.removeMarkersFromMap();
    mapper.addNewStops(response);
}

function buildStopsURL (lat, lon, rad ){
    return "https://transit.land/api/v1/stops?lat=" +
        lat + "&lon=" + lon + "&r=" + rad + "&per_page=2500";
}

function loadPlaceData(){
    placeData = [{
        formatted_address : "Spokane, WA, USA",
        geometry : {
            location : {
                lat : 47.6587802,
                lng : -117.4260466
            },
            viewport : {
                northeast : {
                    lat : 47.758489,
                    lng : -117.3038439
                },
                southwest : {
                    lat : 47.58719199999999,
                    lng : -117.520456
                }
            }
        },
        icon : "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
        id : "648bc7782230a4fe2c4ee6fb68cc84b2330b74f1",
        name : "Spokane",
        place_id : "ChIJ5ee7MFwYnlQRsdmEC9bJ_N0",
        types : [ "locality", "political" ]
    }];
}

function loadMap(latitude, longitude, onSuccess){
    var data = {
        url: '../Controllers/loadGMapsJs.php',
        type: 'GET',
        dataType: "script",
        data: {callback:'initMap'},
        success: onSuccess
    };
    $.ajax(data);
}

function getPlaceData(placeName, onSuccess){
    var data =
    {
        url: '../Controllers/getCoordsFromInput.php',
        type: 'get',
        dataType: "json",
        data: {identifier: placeName},
        success: onSuccess
        //,error: onPlaceQueryError
    };
    $.ajax(data);
}

function initMap() {
    var coords = getCoordsFromPlace(placeData[0]);
    map = new google.maps.Map(document.getElementById('divGMap'), {
        center: {lat: coords.lat, lng: coords.lng},
        backgroundColor: "black",
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });

    //auto zoom
    var viewport = placeData[0].geometry.viewport;
    map.fitBounds(new google.maps.LatLngBounds(viewport.southwest, viewport.northeast));

    buildMapControls();

    mapper.setMap(map);
}

function buildMapControls(){
    var pane = buildPane();
    var searchBox = buildSearchBox();
    var placeName = placeData[0].formatted_address;
    $(searchBox).find('input').val(placeName);

    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(pane);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);

    $(searchBox).find("#btnSearch").on('click', function(){getPlaceData($("#inputSearch").val(), onPlaceQuerySuccess);});

    $(searchBox).find('#inputSearch').on('keypress', function (e) {
        if (e.which == 13) {
            getPlaceData($("#inputSearch").val(), onPlaceQuerySuccess);
            return false;
        }
    });
}

function buildSearchBox(){
    var container = document.createElement('div');
    $(container).addClass('searchwidget');

    //create the menu button
    var divBtn = document.createElement('div');
    $(divBtn).addClass('searchbox-menu-btn-container');

    var menuButton = document.createElement('button');
    $(menuButton).addClass('searchbox-menu-btn').addClass('mi').addClass('mi-menu').addClass('mi-24');
    menuButton.id = "btnMenu";
    divBtn.appendChild(menuButton);
    container.appendChild(divBtn);

    //create the search box
    var _searchBox = document.createElement('div');
    $(_searchBox).addClass('searchbox-container');

    var inputSearch = document.createElement('input');
    $(inputSearch).addClass('form-control');
    inputSearch.type = "text";
    inputSearch.id = "inputSearch";
    inputSearch.name = "destination";
    $(inputSearch).attr("placeholder", "Search Places");
    _searchBox.appendChild(inputSearch);
    container.appendChild(_searchBox);

    var searchBtnContainer = document.createElement('div');
    $(searchBtnContainer).addClass("searchbox-searchbutton-container");

    var searchBtn = document.createElement('button');
    $(searchBtn).addClass("mi").addClass("mi-search").addClass("mi-24")
        .addClass("searchbox-searchbutton");
    searchBtn.id = "btnSearch";

    searchBtnContainer.appendChild(searchBtn);
    container.appendChild(searchBtnContainer);

    return container;
}

function buildPane(){
    var _pane = document.createElement('div');
    _pane.id = "pane";
    $(_pane).addClass('widget-pane');
    $(_pane).hide();
    return _pane;
}

function getCoordsFromPlace(placeData){
    return {lat: placeData.geometry.location.lat,
        lng: placeData.geometry.location.lng};
}

//called when transitioning from start.html to map.html through query
var curPlaceResultNum = -1;
function onFirstPlaceQuerySuccess(response){
    console.log("got place: ");
    console.log(response);
    placeData = response.results;

    var curPlace = placeData[++curPlaceResultNum];
    var coords = getCoordsFromPlace(curPlace);
    loadMap(coords.lat, coords.lng);
}


function onPlaceQuerySuccess(response){
    //TODO: replace query string with place
    placeData = response.results;

    //TODO: update results in sidebar and open it

    //pan to location
    var sw = placeData[0].geometry.viewport.southwest;
    var ne = placeData[0].geometry.viewport.northeast;

    var latlngList = [];
    latlngList.push(new google.maps.LatLng(sw.lat, sw.lng));
    latlngList.push(new google.maps.LatLng(ne.lat, ne.lng));

    var bounds = new google.maps.LatLngBounds();
    $.each(latlngList, function(i,n){
        bounds = bounds.extend(n);
    });

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(map.getZoom()-1);
}