<?php

function generaSessionID($ruolo, $username){
    $id = uniqid($ruolo."_".$username);
    salvaUniqueIDSessione($username, $id);
    return $id;
}

function salvaUniqueIDSessione($username = "", $id = ""){
    if(!$username || !$id){
        throw new InvalidArgumentException("Username o id vuoto per generare una sessione");
    }
    //Mi assicuro che sia stato già chiamato session_start()
    if(session_status() !== PHP_SESSION_ACTIVE){
        session_start();
    }
    $_SESSION[$username] = $id;
}

function isAuth(){
    return isset(apache_request_headers()['Authorization']);
}

function controllaSessione($ruoli = array()){
    $headers = apache_request_headers();
    if(!isset($headers['Authorization'])){
        header(HTTP_V." 401 Unauthorized");
        echo "<results value=\"Identificativo non valido\" />";
        exit;  
    }
    $id = $headers['Authorization'];

    //Prima ottengo il ruolo (Primo underscore)
    $firstUnderscoreIndex = strpos($id, "_");
    $ruolo = substr($id, 0, $firstUnderscoreIndex);
    validaRuolo($ruolo);
    //Controllo che il ruolo sia quello abilitato

    if(!permessoRuolo($ruoli, $ruolo)){
        header(HTTP_V. " 403 Forbidden");
        echo "<results value=\"Essendo " . $ruolo . " non ti è permessa questa funzione (". implode(',', $ruoli ) . ")\" />";
        exit;
    }

    //Non posso sapere se lo username contenga un underscore, ma so il ruolo e anche che id generato da uniqueid è lungo 
    //13 caratteri https://www.php.net/manual/en/function.uniqid.php
    $username = substr($id, $firstUnderscoreIndex+1, strlen($id)-$firstUnderscoreIndex-13-1);
    //Confronto idValue con quello in $_SESSION
    if(session_status() !== PHP_SESSION_ACTIVE){
        session_start();
    }
    $tmp = $_SESSION[$username];
    if(strcmp($tmp, $id) != 0){
        header(HTTP_V." 401 Unauthorized");
        echo "<results value=\"Identificativo non valido\" />";
        exit;  
    }
}

function permessoRuolo($ruoli, $ruolo){
    foreach($ruoli as $r){
        if(strcmp($r, $ruolo) == 0){
            return true;
        }
    }
    return false;
}

function validaRuolo($ruolo){
    switch($ruolo){
        case RUOLO_CAMERIERE:
        case RUOLO_MAGAZZINIERE:
        case RUOLO_PIZZAIOLO:
        case RUOLO_RESPONSABILE:
        break;
        default:
            header(HTTP_V." 401 Unauthorized");
            echo "<results value=\"Identificativo non valido\" />";
            exit;  
    }
}

function eliminaSessione(){
    $headers = apache_request_headers();
    $id = $headers['Authorization'];
    //Prima ottengo il ruolo (Primo underscore)
    $firstUnderscoreIndex = strpos($id, "_");
    //Non posso sapere se lo username contenga un underscore, ma so il ruolo e anche che id generato da uniqueid è lungo 
    //13 caratteri https://www.php.net/manual/en/function.uniqid.php
    $username = substr($id, $firstUnderscoreIndex+1, strlen($id)-$firstUnderscoreIndex-13-1);
    //Confronto idValue con quello in $_SESSION
    unset($_SESSION[$username]);
}

?>