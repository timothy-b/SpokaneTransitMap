console.log("map.html");
var queryString = location.search;
var map = {};
var placeData = {};
var mapper = Mapper.getInstance();
var userLocation = {};

$(document).ready(function(){
    if (queryString == null || queryString == "") {    //show the map
        loadSpokanePlaceData();
        var sw = placeData[0].geometry.viewport.southwest;
        var ne = placeData[0].geometry.viewport.northeast;
        loadMap(function(){loadStopsInBox(sw, ne, 0)});
    }

    if (queryString.includes('showAllStops=true')){
        loadSpokanePlaceData();
        loadMap(function(){loadStopsAtPoint(47.6587802, -117.4260466, 40000, 0);});
    }

    else if (queryString.includes('destination=')) { //find the stops around a destination
        var destination = $.query.get('destination');
        $("#inputSearch").val(destination);
        getPlaceData(destination, onFirstPlaceQuerySuccess);
    }
});

function loadMap(onSuccess){
    var data = {
        url: '../Controllers/loadGMapsJs.php',
        type: 'GET',
        dataType: "script",
        data: {callback:'initMap'},
        success: onSuccess
    };
    $.ajax(data);
}

function loadStopsAtPoint(latitude, longitude, radius, offset){
    var data = {
        url: buildStopsPointURL(latitude, longitude, radius, offset),
        type: 'get',
        dataType: 'json',
        success: onStopsPointQuerySuccess(latitude, longitude, radius),
        error: function(jqXHR, textStatus, errorThrown){console.error(jqXHR); console.error(textStatus); console.error(errorThrown);}
    };
    $.ajax(data);
}

function loadStopsInBox(southwest, northeast, offset){
    var data = {
        url: buildStopsBoxURL(southwest, northeast, offset),
        type: 'get',
        dataType: 'json',
        success: onStopsBoxQuerySuccess(southwest, northeast, offset),
        error: function(jqXHR, textStatus, errorThrown){console.error(jqXHR); console.error(textStatus); console.error(errorThrown);}
    };
    $.ajax(data);
}

function buildStopsBoxURL(sw, ne, off){
    console.log(sw);
    console.log(ne);
    return "https://transit.land/api/v1/stops?bbox=" +
        sw.lng + "," + sw.lat + "," + ne.lng + "," + ne.lat + "&offset=" + off + "&per_page=100";
}

function buildStopsPointURL (lat, lon, rad, off){
    return "https://transit.land/api/v1/stops?lat=" +
        lat + "&lon=" + lon + "&r=" + rad + "&offset=" + off + "&per_page=100";
}

function onStopsPointQuerySuccess(latitude, longitude, radius){
    return function(data, textStatus, jqXHR){
        console.log("got stops:");
        console.log(data);

        mapper.addNewStops(data);

        if(data.meta.hasOwnProperty('next')){
            loadStopsAtPoint(latitude, longitude, radius, data.meta.offset + 100);
        } else {
            var $buttons = $("#togglePane").find(':checkbox');
            $buttons.bootstrapSwitch('disabled', false);
        }
    };
}

function onStopsBoxQuerySuccess(southwest, northeast, offset){
    return function(data, textStatus, jqXHR){
        console.log("got stops:");
        console.log(data);

        mapper.addNewStops(data);

        if(data.meta.hasOwnProperty('next')){
            loadStopsInBox(southwest, northeast, data.meta.offset + 100);
        } else {
            var $buttons = $("#togglePane").find(':checkbox');
            $buttons.bootstrapSwitch('disabled', false);
        }
    };
}

function loadSpokanePlaceData(){
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
    var searchBox = buildSearchBox();
    var placeName = placeData[0].formatted_address;
    $(searchBox).find('input').val(placeName);

    var routeSelector = buildRouteSelector();
    var togglePane = buildTogglePane();

    //map.controls[google.maps.ControlPosition.LEFT_CENTER].push(pane);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBox);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(routeSelector);
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(togglePane);

    var $buttons = $(togglePane).find(':checkbox');
    $buttons.bootstrapSwitch('disabled', true);
    $buttons.bootstrapSwitch('state', false, true);


    $(searchBox).find("#btnSearch").on('click', function(){getPlaceData($("#inputSearch").val(), onPlaceQuerySuccess);});

    $(searchBox).find('#inputSearch').on('keypress', function (e) {
        if (e.which == 13) {
            getPlaceData($("#inputSearch").val(), onPlaceQuerySuccess);
            return false;
        }
    });
}

function buildRouteSelector(){
    var container = document.createElement('div');
    $(container).addClass('routeSelector-container');

    var selectList = document.createElement('select');
    selectList.id = "sel_route_id";
    selectList.style.height = "100%";
    $(selectList).on('click', showIfEnabled);
    $(selectList).on('keydown', showIfEnabled);
    container.appendChild(selectList);

    return container;
}

function showIfEnabled(){
    if ($("#toggleStops").bootstrapSwitch('state'))
        mapper.showStopsByRouteId();
    else
        mapper.hideMarkers();

    mapper.removeRouteLinesFromMap();
    if ($("#toggleRoutes").bootstrapSwitch('state'))
        mapper.showRouteLineByID();
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
    $(menuButton).on('click', function(){alert('threw NotImplementedException(" (╯°□°）╯︵ ┻━┻  ")');});

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

function buildTogglePane(){
    var container = document.createElement('div');
    container.id = "togglePane";
    $(container).addClass('togglePane');

    var divStops = document.createElement('div');
    divStops.id = "divStops";
    $(divStops).addClass("toggle-button-container");
    var toggleStops = document.createElement('input');
    toggleStops.type = "checkbox";
    toggleStops.id = "toggleStops";
    $(toggleStops).on('switchChange.bootstrapSwitch', mapper.toggleStops);
    toggleStops.dataset.labelText = "stops";
    toggleStops.dataset.size = "small";
    divStops.appendChild(toggleStops);

    var divRoutes = document.createElement('div');
    divRoutes.id = "divRoutes";
    $(divRoutes).addClass("toggle-button-container");
    var toggleRoutes = document.createElement('input');
    toggleRoutes.type = "checkbox";
    toggleRoutes.id = "toggleRoutes";
    $(toggleRoutes).on('switchChange.bootstrapSwitch', mapper.toggleRoutes);
    toggleRoutes.dataset.labelText = "routes";
    toggleRoutes.dataset.size = "small";
    divRoutes.appendChild(toggleRoutes);

    var divTraffic = document.createElement('div');
    divTraffic.id = "divTraffic";
    $(divTraffic).addClass("toggle-button-container");
    var toggleTraffic = document.createElement('input');
    toggleTraffic.type = "checkbox";
    toggleTraffic.id = "toggleTraffic";
    $(toggleTraffic).on('switchChange.bootstrapSwitch', mapper.toggleTraffic);
    toggleTraffic.dataset.labelText = "traffic";
    toggleTraffic.dataset.size = "small";
    divTraffic.appendChild(toggleTraffic);

    container.appendChild(divStops);
    container.appendChild(divRoutes);
    container.appendChild(divTraffic);
    return container;
}



function getCoordsFromPlace(placeData){
    return {lat: placeData.geometry.location.lat,
        lng: placeData.geometry.location.lng};
}

//called when transitioning from start.html to map.html through query
function onFirstPlaceQuerySuccess(response){
    console.log("got place: ");
    console.log(response);
    placeData = response.results;

    var sw = placeData[0].geometry.viewport.southwest;
    var ne = placeData[0].geometry.viewport.northeast;
    loadMap(function(){loadStopsInBox(sw, ne, 0)});
}


function onPlaceQuerySuccess(response){
    //TODO: replace query string with place
    placeData = response.results;

    //TODO: update results in sidebar and open it
    /*
    if (placeData.length > 1){
        loadWidgetPane();
        showWidgetPane();
    }*/

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

    var viewport = map.getBounds();
    //get a literal copy
    viewport.sw = JSON.parse(JSON.stringify(viewport.getSouthWest()));
    viewport.ne = JSON.parse(JSON.stringify(viewport.getNorthEast()));
    loadStopsInBox(viewport.sw, viewport.ne, 0);
}