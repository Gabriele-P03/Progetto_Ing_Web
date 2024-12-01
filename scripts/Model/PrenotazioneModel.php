<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class PrenotazioneModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAllByUserID($userid){

    }

    public function getBozzaByUserID($userid){
        return $this->select("SELECT ID_HASH, " . DB_PRENOTAZIONE_NOME . ", " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . ", " .
                        DB_PRENOTAZIONE_DATAAVVENIMENTO . ", " . DB_PRENOTAZIONE_STATO . ", " . DB_PRENOTAZIONE_IDTAVOLO . ", " . 
                        DB_PRENOTAZIONE_NUMEROPERSONE . ", " . DB_PRENOTAZIONE_TIPO . ", " . DB_PRENOTAZIONE_DESCRIZIONESTATO . ", ". 
                        DB_PRENOTAZIONE_TELEFONO . " FROM " . DB_PRENOTAZIONE . " WHERE " . DB_PRENOTAZIONE_USERID . " = ? AND " . 
                        DB_PRENOTAZIONE_STATO . " = '" . PRENOTAZIONE_STATO_BOZZA . "' ORDER BY " . DB_PRENOTAZIONE_DATAAVVENIMENTO 
                        . " LIMIT 1", array($userid));
    }

    public function save($xml, $userid){
        $asporto = $xml->asporto;
        $numero_persone = $xml->numero_persone;
        $telefono = $xml->telefono;
        $data = $xml->data;

        //$sql = "INSER INTO " . DB_PRENOTAZIONE . " VALUES(NULL, NULL" .  
    }
}

?>