

function getStopsURL ( $lat, $lon, $rad ){
	$stops_TL_API_Call = "https://transit.land/api/v1/stops?lat=" +
							$lat + "&lon=" + $lon + "&r=" + $rad;
							
	return $stops_TL_API_Call;
}

function click_A_Marker(){
	google.maps.event.addListener(marker,'click',function() {
	
	//map.setZoom(9);
	//map.setCenter(marker.getPosition());
  });
}

//JW
//http://stackoverflow.com/questions/2856059/passing-an-array-as-a-function-parameter-in-javascript