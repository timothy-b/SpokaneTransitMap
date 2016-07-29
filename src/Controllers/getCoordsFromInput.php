<?php

/**
 * API Service: Makes a request from the Google Maps API to match a GPS coordinate to match place name to GPS coordinates
 * @param string identifier a name or identifier of a geographical location
 * @return JSON GPS coordinates
 */

require_once("../Credentials/doNotUpload.php");

function validate()
{
    if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] != 'GET') {
        http_response_code(400);
        die('only GET requests are accepted');
    }


    if (!isset($_GET['identifier'])) {
        http_response_code(400);
        die('key identifier not set');
    }
}

function sendRequest()
{
    $identifier = urlencode($_GET['identifier']);

    $url = "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" . GMAPS_JS_API_KEY . "&query=$identifier";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    // Set so curl_exec returns the result instead of outputting it.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //ssl
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // Get the response and close the channel.
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

echo sendRequest();