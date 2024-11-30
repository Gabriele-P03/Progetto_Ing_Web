<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class PrenotazioneModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAllByUserID($userid){
        return $this->select("SELECT ID_HASH, ". DB_PRENOTAZIONE_NOME . ", " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . ", ". DB_PRENOTAZIONE_DATAAVVENIMENTO . ", " 
                                    . DB_PRENOTAZIONE_STATO . ", " . DB_PRENOTAZIONE_IDTAVOLO . ", " . DB_PRENOTAZIONE_NUMEROPERSONE . ", " . DB_PRENOTAZIONE_TIPO . 
                                    ", " . DB_PRENOTAZIONE_DESCRIZIONESTATO . " FROM " . DB_PRENOTAZIONE . " WHERE " . DB_PRENOTAZIONE_USERID . " = ?",
                             array($userid));
    }
}

?>