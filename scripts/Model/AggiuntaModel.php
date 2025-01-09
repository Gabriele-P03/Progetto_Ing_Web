<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class AggiuntaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function impostaAllergeni($idHashAggiunta, $xml){
        //Prima elimino tutte le relazioni precedenti con gli allergeni
        $sql = "DELETE FROM ". DB_AGGIUNTAALLERGENE . " WHERE " . DB_AGGIUNTAALLERGENE_IDAGGIUNTA . " = (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?)";
        $this->delete($sql, 's', array($idHashAggiunta));
        //Ora posso creare le relazioni nuove
        $allergeni = $xml->allergene;
        foreach($allergeni as $key){
            $hash = $key->attributes()[0];
            $sql = "INSERT INTO " . DB_AGGIUNTAALLERGENE . " VALUES(NULL, (SELECT ID FROM ".DB_AGGIUNTA." WHERE ID_HASH = ?), (SELECT ID FROM ".DB_ALLERGENE." WHERE ID_HASH = ?))";
            $this->executeStatement($sql, 'ss', array($idHashAggiunta, $hash));
        }
    }

    public function getAllByPizza(string $idHashPizza){
        $sql = "SELECT " . DB_AGGIUNTA_NOME . ", ID_HASH FROM " . DB_AGGIUNTA;
        if($idHashPizza == 'true'){    //Viene mandato 'true' dal form del pizzaiolo per creare una nuova pizza
            $sql .= " WHERE " . DB_AGGIUNTA_IDTIPOAGGIUNTA . " IN (SELECT ID FROM ". DB_TIPOAGGIUNTA ." WHERE ". DB_TIPOAGGIUNTA_ETICHETTA ." NOT IN ('Bevande'))"; 
            return $this->select($sql, array());
        }else{
            $sql .= " WHERE ID IN 
            (SELECT " . DB_PIZZAAGGIUNTA_IDAGGIUNTA . " FROM " . DB_PIZZAAGGIUNTA . " WHERE " . DB_PIZZAAGGIUNTA_IDPIZZA . " IN 
                (SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?)
            );";
            return $this->select($sql, array($idHashPizza));
        }
        
    }

    public function getAllByTipoAggiuntaExceptByPizzaAndAllergeni($idHashTipoAggiunta = "", $idHashPizza = "", $idHashAllergeni = array()){
        $params = array($idHashTipoAggiunta);
        $sql = "SELECT ID_HASH, " . DB_AGGIUNTA_NOME . ", " . DB_AGGIUNTA_PREZZO . ", " . DB_AGGIUNTA_QUANTITA . " FROM " . DB_AGGIUNTA . " WHERE ID_TIPO_AGGIUNTA IN (" .
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

    public function save($xml){
        $nome = $xml->nome[0]->attributes()[0];
        $quantita = $xml->quantita[0]->attributes()[0];
        $prezzo = $xml->prezzo[0]->attributes()[0];
        $tipoAggiuntaHash = $xml->tipoaggiunta[0]->attributes()[0];
        $this->controllaDuplicatoNomeAggiunta($nome, null);

        $sql = "INSERT INTO " . DB_AGGIUNTA . " VALUES(NULL, NULL, ?, ?, ?, (SELECT ID FROM ". DB_TIPOAGGIUNTA ." WHERE ID_HASH = ?))";    
        $this->insert($sql, "ssss", array($nome, $prezzo, $quantita, $tipoAggiuntaHash), DB_AGGIUNTA);
    }

    public function remove($hash){
        //Non posso eliminare un'aggiunta se questa è usata su una pizza
        $sql = "SELECT * FROM ". DB_PIZZAAGGIUNTA . " WHERE " . DB_PIZZAAGGIUNTA_IDAGGIUNTA . " IN (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?)";
        $res = $this->select($sql, array($hash));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Quest'aggiunta è ancora in uso su delle pizza\" />";
            exit;
        }
        $sql = "DELETE FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?";
        $this->delete($sql, "s", array($hash));
    }

    public function edit($hash, $xml){
        $nome = $xml->nome[0]->attributes()[0];
        $quantita = $xml->quantita[0]->attributes()[0];
        $prezzo = $xml->prezzo[0]->attributes()[0];
        $tipoAggiuntaHash = $xml->tipoaggiunta[0]->attributes()[0];
        $this->controllaDuplicatoNomeAggiunta($nome, $hash);

        $sql = "UPDATE " . DB_AGGIUNTA . " SET " .
            DB_AGGIUNTA_NOME . " = ?," .
            DB_AGGIUNTA_PREZZO . " = ?, ".
            DB_AGGIUNTA_QUANTITA . " = ?, ".
            DB_AGGIUNTA_IDTIPOAGGIUNTA . " = (SELECT ID FROM ". DB_TIPOAGGIUNTA ." WHERE ID_HASH = ?)".
            " WHERE ID_HASH = ?";    
        $this->executeStatement($sql, "sssss", array($nome, $prezzo, $quantita, $tipoAggiuntaHash, $hash));
    }

    private function controllaDuplicatoNomeAggiunta($nome, $hash){
            //Controllo che non ci sia già un'aggiunta con lo stesso nome
        $sql = "SELECT * FROM " . DB_AGGIUNTA . " WHERE " . DB_AGGIUNTA_NOME . " = ?";
        $array = array($nome);
        if($hash != null){
            $sql .= " AND ID_HASH != ?";
            array_push($array, $hash);
        }
        $res = $this->select($sql, $array);
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Vi è già un'aggiunta con questo nome\" />";
            exit;
        }
    }
}



?>