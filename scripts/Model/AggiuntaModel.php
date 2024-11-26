<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class AggiuntaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAllByPizza(string $idHashPizza){
        return $this->select(" 
        SELECT " . DB_AGGIUNTA_NOME . " FROM " . DB_AGGIUNTA ." WHERE ID IN 
            (SELECT " . DB_PIZZAAGGIUNTA_IDAGGIUNTA . " FROM " . DB_PIZZAAGGIUNTA . " WHERE " . DB_PIZZAAGGIUNTA_IDPIZZA . " IN 
                (SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?)
            );",
            array("s", $idHashPizza));
    }
}

?>