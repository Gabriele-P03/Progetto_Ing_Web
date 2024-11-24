<?php

include_once("scripts/connection.php");

$conn = Connection::getInstance();

/**
* Questa funzione è chiamata appena il cliente atterra nella pagina di prenotazione.
* @return SimpleXMLElement Tutti gli allergeni presenti nel DB  
*/

$GET_ALLERGENI_ALL = "SELECT ETICHETTA FROM ".Connection::ALLERGENE_TAB_NAME;
function get_allergeni(): SimpleXMLElement|string{

    global $conn, $GET_ALLERGENI_ALL;
    $res = $conn->query($GET_ALLERGENI_ALL);
    if(!$res){
        header("HTTP/1.1 505 Internal Server Error");
    }
    return "505";

    return Connection::res_to_xml($res);
}

?>