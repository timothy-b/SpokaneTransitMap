/**
 * @summary Singleton which sets up the map and handles programmatic interaction with it.
 */
var Mapper = (function(){
    var instance;

    function init(){

        //region private
        var gMap;
        var gMarkers = [];
        var gRouteNameIdDict = {};
        var gMarkerYou;
        var gRouteLines = [];
        var gTraffic;
        var gPath = "";
        var gToggledStops = false;
        var gToggledRoutes = false;
        //endregion

        return {
            //region public

            initMap: function(){
                gMap = new google.maps.Map(document.getElementById('divGMap'), {
                    center: {lat: 47.492512, lng: -117.58387500000003},
                    zoom: 14
            })},

            setMap: function (mapToSet){
                gMap = mapToSet;
            },

            setPath: function(path){
                gPath = path;
            },

            addNewStops: function(json) {
                this.addNewMarkers(json);
                this.showMarkers();

                this.addNewRouteIds(json);
                this.updateDropdownRouteIds();
            },


            //region marker methods

            addNewMarkers: function(json) {
                if (gMarkers == null)
                    gMarkers = [];
                var newMarkers = this.getMarkersFromStopsRequest(json);
                gMarkers = gMarkers.concat(newMarkers);
            },

            addYouAreHereMarker: function(lat, lng) {
                if (gMarkerYou != null)
                    gMarkerYou.setMap(null);

                gMarkerYou = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    icon: gPath + "../Views/img/you.png"
                });

                gMarkerYou.setMap(gMap);
            },

            buildStopMarker: function(stop) {
                var latLng = new google.maps.LatLng(stop.geometry.coordinates[1], stop.geometry.coordinates[0]);
                var marker = new google.maps.Marker({
                    position: latLng,
                    title: stop.name,
                    icon: gPath + "../Views/img/bus.png",
                    route_numbers: stop.routes_serving_stop
                });

                marker.addListener('click',function() {
                    console.log(this);

                    var infowindow = new google.maps.InfoWindow({
                        content: "<input type=\"button\" onclick=\"mapper.showPromptSaveMarker(\'" + stop.onestop_id + "\')\" value=\"Save Stop\"/>"
                    });
                    infowindow.open(gMap,marker);
                });

                marker.addListener('click', this.onMarkerClicked);
                return marker;
            },

            getMarkersFromStopsRequest: function(json) {
                if (!json.hasOwnProperty('stops')) {
                    console.error('PropertyNotFoundException: stops\n in the following object:');
                    console.error(json);
                    return null;
                }

                var markers = [];
                for (var i = 0; i < json.stops.length; i++) {
                    markers.push(this.buildStopMarker(json.stops[i]));
                }
                return markers;
            },

            hideMarkers: function() {
                for (var i = 0; i < gMarkers.length; i++)
                    gMarkers[i].setMap(null);
            },

            onMarkerClicked: function(){
                var infowindow = new google.maps.InfoWindow({content: this.title + "<br>" + this.getPosition().lat() + "<br>" + this.getPosition().lng() + "<br>"});
                infowindow.open(gMap,this);
            },

            removeMarkersFromMap: function(){
                this.hideMarkers();
                gMarkers = null;
                gRouteNameIdDict = null;
            },

            showMarkers: function(){
                for (var i = 0; i < gMarkers.length; i++)
                    gMarkers[i].setMap(gMap);
            },

            showStopsByRouteId: function(){
                Mapper.getInstance().hideMarkers();

                var selectedId = $('#sel_route_id').find(":selected").val();

                for (var i = 0; i < gMarkers.length; i++) {
                    for (var j = 0; j < gMarkers[i].route_numbers.length; j++) {
                        if (gMarkers[i].route_numbers[j].route_onestop_id.includes(selectedId)) {
                            gMarkers[i].setMap(gMap);
                            break;
                        }
                    }
                }
            },

            showPromptSaveMarker: function(onestop_id)
            {
				var stopsArr = [];
				stopsArr.push(JSON.parse(getSavedStops()));
                var sname = prompt("Please enter the stop name");
                if (sname != null && sname != "") {
                    stopsArr[stopsArr.length] = {name: sname, onestop_id: onestop_id, index: 0};
					document.cookie = "SavedStops" + "=" + JSON.stringify(stopsArr) + "; expires=Thu, 18 Dec 2200 12:00:00 UTC; path=/";
                }
            },
			
			getSavedStops: function (cname="SavedStops") {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i = 0; i <ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length,c.length);
					}
				}
				return "";
			},

            toggleStops: function(){
                if (gToggledStops)
                    Mapper.getInstance().hideMarkers();
                else
                    Mapper.getInstance().showStopsByRouteId();

                gToggledStops = !gToggledStops;
            },

            //endregion markers
	    
            //region traffic

            toggleTraffic: function()
            {
            if(gTraffic == null)
            {
                gTraffic = new google.maps.TrafficLayer();
                gTraffic.setMap(gMap);
            }
            else
            {
                gTraffic.setMap(null);
                gTraffic = null;
            }
            },

            //endregion
	    
            //region routes

            addNewRouteIds: function(json){
                if (gRouteNameIdDict == null)
                    gRouteNameIdDict = {};
                var newRouteIds = this.getNewRouteIds(json);
                for (var newRouteId in newRouteIds)
                    gRouteNameIdDict[newRouteId] = newRouteIds[newRouteId];
            },

            getNewRouteIds: function(json){
                var newRouteIds = {};

                for (var s = 0; s < json.stops.length; s++) {
                    var stop = json.stops[s];
                    for (var r = 0; r < stop.routes_serving_stop.length; r++) {
                        var route = stop.routes_serving_stop[r];
                        newRouteIds[route.route_onestop_id] = route.route_name;
                    }
                }
                //console.log(newRouteIds);
                return newRouteIds;
            },

            updateDropdownRouteIds: function(){
                var $dropdown = $("#sel_route_id");
                $dropdown.html("");

                var sortableRoutes = [];
                for (var routeId in gRouteNameIdDict)
                    sortableRoutes.push([routeId, gRouteNameIdDict[routeId]]);
                sortableRoutes.sort( function(a,b){return a[1].localeCompare(b[1],'kn', {numeric: true});} );

                for (var i = 0; i < sortableRoutes.length; i++)
                    $dropdown.append("<option value=\""+ sortableRoutes[i][0] +"\">"+ sortableRoutes[i][1] + "</option>");
            },

            showRouteLineByID: function(){
                $.get("https://transit.land/api/v1/route_stop_patterns?traversed_by=" + $("#sel_route_id").val(), Mapper.getInstance().drawRoutePolyLine);
            },

            drawRoutePolyLine: function(json)
            {
                var data = json.route_stop_patterns;
                var routeCoordinates = [];
                for(var x = 0; x < data.length; x++)
                {
                    if(!data[x].is_modified)
                    {
                        for(var y = 0; y < data[x].geometry.coordinates.length; y++)
                        {
                            var coords = {lat:data[x].geometry.coordinates[y][1],lng:data[x].geometry.coordinates[y][0]};
                            routeCoordinates.push(coords);
                            coords = [];
                        }
                        var routePath = new google.maps.Polyline({
                            path: routeCoordinates,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 4
                        });
                        routePath.setMap(gMap);
                        gRouteLines.push(routePath);
                        routeCoordinates = [];
                    }
                }
            },

            removeRouteLinesFromMap: function() {
                for (var i = 0; i < gRouteLines.length; i++)
                    gRouteLines[i].setMap(null);
                gRouteLines = [];
            },

            toggleRoutes: function(){
                Mapper.getInstance().removeRouteLinesFromMap();
                if (!gToggledRoutes)
                    Mapper.getInstance().showRouteLineByID();
                gToggledRoutes = !gToggledRoutes;
            }
            //endregion routes

            //endregion public
        };
    }

    return {
        // Get the Singleton instance if one exists or create one if it doesn't
        getInstance: function () {
            if ( !instance )
                instance = init();

            return instance;
        }
    };
})();