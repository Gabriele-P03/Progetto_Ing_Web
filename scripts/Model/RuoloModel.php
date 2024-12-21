<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class RuoloModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getByIdentificativoRuolo(int $identificativo){

        $sql = 'SELECT ' . DB_RUOLO_NOME . ' FROM ' . DB_RUOLO . " WHERE " . DB_RUOLO_IDENTIFICATIVO . " = ?";
        $res = $this->select($sql, array($identificativo));
        if(sizeof($res) !== 1){
            header(HTTP_V . " 505 Internal Server Error");
            echo "Errore nel reperire il ruolo tramite identificativo: " . $identificativo;
            exit;
        }
        return $res;
    }
}

?>