<?php

$prenotazioneModel = new PrenotazioneModel();

function controllaCookie($cname){
    if(empty($_COOKIE[$cname])){
        //Non vi è un cookie, lo creo
        creaNuovoCookie($cname);
    }
    $cookie = $_COOKIE[$cname];
    return $cookie;
}

function creaNuovoCookie($cname){
    global $prenotazioneModel;
    $id = "";
    $flag = true;
    do{
        $id = uniqid();
        $res = $prenotazioneModel->select("SELECT " . DB_PRENOTAZIONE_USERID . " FROM " . DB_PRENOTAZIONE . 
                                    " WHERE " . DB_PRENOTAZIONE_USERID ." = ?", array($id));
        if(count($res) == 0){
            $flag = false;
        }
    }while($flag);
    setcookie($cname, $id, time()+60*60*24*3);
}


function parseCookie($cookie){

}

?>