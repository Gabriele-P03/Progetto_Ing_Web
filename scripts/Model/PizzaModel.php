<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class PizzaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getAll(){
        return $this->select("SELECT ". DB_PIZZA_IDHASH . ", " . DB_PIZZA_NOME .", ". DB_PIZZA_PREZZO ." FROM ". DB_PIZZA);
    }
}

?>