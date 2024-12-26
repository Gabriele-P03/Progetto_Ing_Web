<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class TipoAggiuntaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAll(){
        return $this->select("SELECT ID_HASH, ". DB_TIPOAGGIUNTA_ETICHETTA . " FROM ". DB_TIPOAGGIUNTA);
    }


    public function save($xml){
        $nuovaEtichetta = $xml->etichetta[0]->attributes()[0];
        $sql = "SELECT * FROM " . DB_TIPOAGGIUNTA . " WHERE ETICHETTA = ?";
        $res = $this->select($sql, array($nuovaEtichetta));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results status=\"Vi è già un tipo aggiunta col nome " . $nuovaEtichetta . "\" />";
            exit;
        }
        $sql = "INSERT INTO " . DB_TIPOAGGIUNTA . " VALUES(NULL, NULL, ?)";
        return $this->insert($sql, "s", array($nuovaEtichetta), DB_TIPOAGGIUNTA);
    }

    public function edit($hash, $xml){
        $nuovaEtichetta = $xml->etichetta[0]->attributes()[0];
        $sql = "SELECT * FROM " . DB_TIPOAGGIUNTA . " WHERE ETICHETTA = ? AND ID_HASH != ?";
        $res = $this->select($sql, array($nuovaEtichetta, $hash));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results status=\"Vi è già un tipo aggiunta col nome " . $nuovaEtichetta . "\" />";
            exit;
        }
        $sql = "UPDATE " . DB_TIPOAGGIUNTA . " SET " . DB_TIPOAGGIUNTA_ETICHETTA . " = ? WHERE ID_HASH = ?";
        $this->executeStatement($sql, "ss", array($nuovaEtichetta, $hash));
    }

    public function remove($hash){
        //Controllo prima che non ci siano aggiunte collegate
        $sql = "SELECT * FROM " . DB_TIPOAGGIUNTA . " WHERE ID IN (SELECT ID_TIPO_AGGIUNTA FROM " . DB_AGGIUNTA . ") AND ID_HASH = ?";
        $res = $this->select($sql, array($hash));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results status=\"Ci sono delle aggiunte di questo tipo\" />";
            exit;
        }
        $sql = "DELETE FROM " . DB_TIPOAGGIUNTA . " WHERE ID_HASH = ?";
        $this->delete($sql, "s", array($hash));
    }
}

?>