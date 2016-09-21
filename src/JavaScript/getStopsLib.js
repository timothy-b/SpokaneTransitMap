

function getStopsURL ( $lat, $lon, $rad ){
	$stops_TL_API_Call = "https://transit.land/api/v1/stops?lat=" +
							$lat + "&lon=" + $lon + "&r=" + $rad;
							
	return $stops_TL_API_Call;
}

function click_A_Marker(){
	google.maps.event.addListener(marker,'click',function() {
		
		var infowindow = new google.maps.InfoWindow({
		content:"<input type=\"button\" onclick=\"showPrompt(" + this.position.lat() + "," + this.position.lng() + ")\"value=\"Save Stop\"/>"
		});
		infowindow.open(map,marker);
		});
	//map.setZoom(9);
	//map.setCenter(marker.getPosition());
  //)};
}

function showPrompt($la, $lo)
{
   var sname = prompt("Please enter the stop name");
    if (sname != null && sname != "") {
        document.cookie = sname + "=" + $la + "," + $lo;
    }
}

//JW
//http://stackoverflow.com/questions/2856059/passing-an-array-as-a-function-parameter-in-javascript