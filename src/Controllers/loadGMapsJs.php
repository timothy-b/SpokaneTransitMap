<?php
/**
 * Use this to prevent clientside exposure of the Google Maps Javasctiot API key.
 */
require_once("../Credentials/doNotUpload.php");

function validate()
{
    if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] != 'GET') {
        http_response_code(400);
        die('only GET requests are accepted');
    }

    if (!isset($_GET['callback'])) {
        http_response_code(400);
        die('key \'callback\' not set');
    }
}

function sendRequest()
{
    $callback = urlencode($_GET['callback']);
    $url = "https://maps.googleapis.com/maps/api/js?key=".GMAPS_JS_API_KEY."&callback=$callback";

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

validate();
echo sendRequest();