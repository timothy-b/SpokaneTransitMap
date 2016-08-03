/**
 * @summary Sets up the map and handles programmatic interaction with it.
 */

var Mapper = (function(){
    var instance;

    function init(){

        //region private
        var map;
        var gMarkers = [];
        var gRouteNameIdDict = {};
        var gMarkerYou;
        //endregion

        return {
            //region public

            initMap: function(){
                map = new google.maps.Map(document.getElementById('divGMap'), {
                    center: {lat: 47.492512, lng: -117.58387500000003},
                    zoom: 14
            })},

            setMap: function (map){
                this.map = map;
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
                    icon: "./you.png"
                });

                gMarkerYou.setMap(map);
            },

            buildStopMarker: function(stop) {
                var latLng = new google.maps.LatLng(stop.geometry.coordinates[1], stop.geometry.coordinates[0]);
                var marker = new google.maps.Marker({
                    position: latLng,
                    title: stop.name,
                    icon: "./bus.png",
                    route_numbers: stop.routes_serving_stop
                });
                marker.addListener('click',function() {
                    console.log(this);

                    var infowindow = new google.maps.InfoWindow({
                        content: "<input type=\"button\" onclick=\"mapper.showPromptSaveMarker(\'" + stop.onestop_id + "\')\" value=\"Save Stop\"/>"
                    });
                    infowindow.open(map,marker);
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
                infowindow.open(map,this);
            },

            removeMarkersFromMap: function(){
                this.hideMarkers();
                gMarkers = null;
                gRouteNameIdDict = null;
            },

            showMarkers: function(){
                for (var i = 0; i < gMarkers.length; i++)
                    gMarkers[i].setMap(map);
            },

            showPromptSaveMarker: function(onestop_id)
            {
                var sname = prompt("Please enter the stop name");
                if (sname != null && sname != "") {
                    document.cookie = sname + "=" + onestop_id + "; expires=Thu, 18 Dec 2200 12:00:00 UTC; path=/";
                }
            },

            //endregion markers

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
                console.log(newRouteIds);
                return newRouteIds;
            },

            showRoutesByRouteId: function(){
                this.hideMarkers();

                var selectedId = $('#sel_route_id').find(":selected").val();

                for (var i = 0; i < gMarkers.length; i++) {
                    for (var j = 0; j < gMarkers[i].route_numbers.length; j++) {
                        if (gMarkers[i].route_numbers[j].route_onestop_id.includes(selectedId)) {
                            gMarkers[i].setMap(map);
                            break;
                        }
                    }
                }
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
            
            drawRoutePolyLines: function(json){
            	var data = json.route_stop_patterns;
            	var routeCoordinates = [];
            	var x = 3;
            	for(var x = 0; x < data.length; x++)
            	{
            		for(var y = 0; y < data[x].geometry.coordinates.length; y++)
            		{
            			var coords = {lat:data[x].geometry.coordinates[y][1],lng:data[x].geometry.coordinates[y][0]};
            		}
            		var routePath = new google.maps.Polyline({
                      path: routeCoordinates,
                      geodesic: true,
                      strokeColor: '#FF0000',
                      strokeOpacity: 1.0,
                      strokeWeight: 4
                    });
            		routePath.setMap(map);
            		routeCoordinates = [];
            	}
            }

            //endregion

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
