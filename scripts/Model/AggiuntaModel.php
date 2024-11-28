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
            array($idHashPizza));
    }

    public function getAllByTipoAggiuntaExceptByPizzaAndAllergeni($idHashTipoAggiunta = "", $idHashPizza = "", $idHashAllergeni = array()){
        $params = array($idHashTipoAggiunta);
        $sql = "SELECT ID_HASH, " . DB_AGGIUNTA_NOME . ", " . DB_AGGIUNTA_PREZZO . " FROM " . DB_AGGIUNTA . " WHERE ID_TIPO_AGGIUNTA IN (" .
                "SELECT ID FROM " . DB_TIPOAGGIUNTA . " WHERE ID_HASH = ?)";
        if($idHashPizza !== ""){
            $sql = $sql . " AND ID NOT IN ( SELECT ".  DB_PIZZAAGGIUNTA_IDAGGIUNTA . " FROM " . DB_PIZZAAGGIUNTA . " WHERE ID_PIZZA IN ("
             . "SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?))"; 
            
            array_push($params, $idHashPizza);
        };        
        if(count($idHashAllergeni) > 0){
            $sql = $sql . " AND ID NOT IN ( SELECT " . DB_AGGIUNTAALLERGENE_IDAGGIUNTA . " FROM " . DB_AGGIUNTAALLERGENE . " WHERE " .
                DB_AGGIUNTAALLERGENE_IDALLERGENE . " IN ( SELECT ID FROM " . DB_ALLERGENE . " WHERE ID_HASH IN (?".
                str_repeat(",?", count($idHashAllergeni) -1) . ")));";
            
            $params = array_merge($params, $idHashAllergeni);    
        }


        return $this->select($sql, $params);
    }
}

?>