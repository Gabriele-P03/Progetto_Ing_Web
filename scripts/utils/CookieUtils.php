<?php

$prenotazioneModel = new PrenotazioneModel();

function controllaCookie($cname){
    $cookie = "";
    if(empty($_COOKIE[$cname])){
        //Non vi è un cookie, lo creo
        creaNuovoCookie($cname);
    }else{
        $cookie = $_COOKIE[$cname];
        $secs = time();
        $secs += 60*60*24*400;  //max 400 giorni di exp days causa Google Chrome
        setcookie($cname, $cookie, $secs,"/");//Updating cookie
    }
    return $cookie;
}

function creaNuovoCookie($cname){
    global $prenotazioneModel;
    $id = "";
    $flag = true;
    //Genero uno uniqid finchè vi è traccia tra le prenotazioni
    do{
        $id = uniqid();
        $res = $prenotazioneModel->select("SELECT " . DB_PRENOTAZIONE_USERID . " FROM " . DB_PRENOTAZIONE . 
                                    " WHERE " . DB_PRENOTAZIONE_USERID ." = ?", array($id));
        if(count($res) == 0){
            $flag = false;
        }
    }while($flag);
    $secs = time();
    $secs += 60*60*24*400;  //max 400 giorni di exp days causa Google Chrome
    setcookie($cname, $id, $secs,"/");//Updating cookie
}

?>