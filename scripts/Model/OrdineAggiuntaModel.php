<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class OrdineAggiuntaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function save($idHashOrdine = "", $idHashAggiunta = ""){
        $sql = "INSERT INTO " . DB_ORDINEAGGIUNTA . " VALUES(NULL, NULL, (SELECT ID FROM " . DB_ORDINE ." WHERE ID_HASH = ?), (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?))";
        $this->insert( $sql , "ss", array($idHashOrdine, $idHashAggiunta), DB_ORDINEAGGIUNTA);
    }

    public function deleteByIdHashOrdine($idHashOrdine = ""){
        $sql = "DELETE FROM " . DB_ORDINEAGGIUNTA . " WHERE " . DB_ORDINEAGGIUNTA_IDORDINE . " IN (SELECT ID FROM " . DB_ORDINE . " WHERE ID_HASH = ?)";
        $this->delete($sql, "s", array($idHashOrdine));
    }
}

?>