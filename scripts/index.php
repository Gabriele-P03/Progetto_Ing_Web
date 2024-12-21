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
require PROJECT_ROOT_PATH . "/Controller/Api/PizzaController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/AggiuntaController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/TipoAggiuntaController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/OrdineController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/PrenotazioneController.php";
require PROJECT_ROOT_PATH . "/Controller/Api/AnagraficaController.php";

try{
    $allergeniController = new AllergeniController(); 
    $pizzaController = new PizzaController(); 
    $aggiuntaController = new AggiuntaController(); 
    $tipoAggiuntaController = new TipoAggiuntaController();
    $prenotazioneController = new PrenotazioneController();
    $ordineController = new OrdineController();
    $anagraficaController = new AnagraficaController();
} catch ( Exception $e ){
    header(HTTP_V." 505 Internal Server Error");
    echo "\"".$e->getMessage()."\"";
    exit;
}

switch ($module) {

    case MODULE_ALLERGENE:
        $allergeniController->{$uri}();
    break;
    case MODULE_PIZZA:
        $pizzaController->{$uri}();
    break;
    case MODULE_AGGIUNTA:
        $aggiuntaController->{$uri}();
    break;
    case MODULE_TIPOAGGIUNTA:
        $tipoAggiuntaController->{$uri}();
    break;
    case MODULE_PRENOTAZIONE:
        $prenotazioneController->{$uri}();
    break;
    case MODULE_ORDINE:
        $ordineController->{$uri}();
    break;
    case MODULE_ANAGRAFICA:
        $anagraficaController->{$uri}();
    break;

    default:
        header(HTTP_V." 404 Not Found");
        echo "\"API non valida\"".$module;
        exit;
}

?>