<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class UserModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAll(){
        return $this->select("SELECT " . DB_ALLERGENE_ETICHETTA ." FROM ". DB_ALLERGENE);
    }
}

?>