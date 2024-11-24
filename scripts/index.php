<?php

require_once __DIR__."/inc/bootstrap.php";
require_once __DIR__."/inc/config.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/index.php', $uri);



$module = "";

if (isset($uri[1]) && $uri[1]){

    $path = (string) $uri[1];

    if( !str_starts_with($path, '/') ){
        header (HTTP_V." 422 Unprocessable Entity");
        echo"";
        exit;
    }else{
        $path = substr($path, 1);
    }

    $uri_path = explode('/', $path, 2);

    if( !isset($uri[1]) || $uri[1] == ''){
        header (HTTP_V." 422 Unprocessable Entity");
        echo"";
    }

    $module = $uri_path[0];
    $uri = $uri_path[1];
}

require PROJECT_ROOT_PATH . "/Controller/Api/AllergeniController.php";

try{
    $allergeniController = new AllergeniController(); 
} catch ( Exception $e ){
    header(HTTP_V." 505 Internal Server Error");
    echo "\"".$e->getMessage()."\"";
    exit;
}

switch ($module) {

    case MODULE_ALLERGENI:

        $allergeniController->{$uri}();
    break;

    default:
        header(HTTP_V." 404 Not Found");
        echo "\"API non valida\"".$module;
        exit;
}

?>