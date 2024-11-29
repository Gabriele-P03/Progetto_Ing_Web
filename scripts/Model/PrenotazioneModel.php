<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class PrenotazioneModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAllByToken($cookie){
        return $this->select("SELECT ID_HASH, ". DB_TIPOAGGIUNTA_ETICHETTA . " FROM ". DB_TIPOAGGIUNTA);
    }
}

?>