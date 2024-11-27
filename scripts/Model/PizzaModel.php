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

    public function getAllFilterByAllergeni($idHashAllergeni = array()){

        if($idHashAllergeni){
            /* '?' fuori da str_repeat e poi ',?' poichè giustamente l'ultimo non deve essere seguito dalla virgola    */
            $sql = "SELECT ID_HASH, " . DB_PIZZA_NOME . ", ". DB_PIZZA_PREZZO . " FROM PIZZA WHERE ID NOT IN (
                SELECT ID_PIZZA FROM PIZZA_AGGIUNTA WHERE ID_AGGIUNTA IN (
                    SELECT ID_AGGIUNTA FROM AGGIUNTA_ALLERGENE WHERE ID_ALLERGENE IN (                 
                        SELECT ID FROM ALLERGENE WHERE ID_HASH IN ( ?" . str_repeat(",?", count($idHashAllergeni)-1 ) . ")
                    )    
                )
            );";
            return $this->select($sql, $idHashAllergeni);
        }else{
            throw new Exception("Nessun allergene passato");
        }
    }
}

?>