<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class OrdineAllergeneModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function save($idHashOrdine = "", $idHashAllergene = ""){
        $sql = "INSERT INTO " . DB_ORDINEALLERGENE . " VALUES(NULL, NULL, (SELECT ID FROM " . DB_ORDINE ." WHERE ID_HASH = ?), (SELECT ID FROM " . DB_ALLERGENE . " WHERE ID_HASH = ?))";
        $this->insert( $sql , "ss", array($idHashOrdine, $idHashAllergene), DB_ORDINEALLERGENE);
    }
}

?>