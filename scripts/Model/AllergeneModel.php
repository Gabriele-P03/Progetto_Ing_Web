<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class AllergeneModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAll(){
        return $this->select("SELECT ID_HASH, " . DB_ALLERGENE_ETICHETTA ." FROM ". DB_ALLERGENE);
    }

    public function getAllByAggiunta($hashAggiunta){
        $sql = "SELECT * FROM " . DB_ALLERGENE . " WHERE ID IN (SELECT ID_ALLERGENE FROM " . DB_AGGIUNTAALLERGENE . " WHERE ID_AGGIUNTA IN (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?))";
        $res = $this->select($sql, array($hashAggiunta));
        return $res;
    }

    public function remove($hash){
        $sql = "SELECT * FROM " . DB_AGGIUNTAALLERGENE . " WHERE ID_ALLERGENE IN (SELECT ID FROM " . DB_ALLERGENE . " WHERE ID_HASH = ?)";
        $res = $this->select($sql, array($hash));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Ci sono delle aggiunte collegate a quest'allergene\" />";
            exit;
        }
        $sql = "DELETE FROM " . DB_ALLERGENE . " WHERE ID_HASH = ?";
        $this->delete($sql, "s", array($hash));
    }

    public function save($xml){
        $nome = $xml->nome[0]->attributes()[0];
        $this->checkAllergeneEsistente($nome, null);
        $sql = "INSERT INTO " . DB_ALLERGENE . " VALUES(NULL,NULL,?)";
        $this->insert($sql, "s", array($nome), DB_ALLERGENE);
    }

    public function edit($hash, $xml){
        $nome = $xml->nome[0]->attributes()[0];
        $this->checkAllergeneEsistente($nome, $hash);
        $sql = "UPDATE ". DB_ALLERGENE . " SET " . DB_ALLERGENE_ETICHETTA . " = ? WHERE ID_HASH = ?";
        $this->executeStatement($sql, "ss", array($nome, $hash)); 
    }

    private function checkAllergeneEsistente($nome, $hash){
        $sql = "SELECT * FROM ". DB_ALLERGENE . " WHERE ".DB_ALLERGENE_ETICHETTA." = ? ";
        $array = array($nome);
        if($hash != null){
            $sql .= " AND ID_HASH = ?";
            array_push($array, $hash);
        } 
        $res = $this->select($sql, $array);
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"VI è già un allergene così chiamato\" />";
            exit;
        }
    }
}

?>