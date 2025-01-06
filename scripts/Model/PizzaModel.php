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

    public function save($xml){
        $pizzaXML = $xml->pizza[0];
        $nome = $pizzaXML->attributes()[0];
        $this->checkNomePizzaPresente($nome, null);
        $prezzo = $pizzaXML->attributes()[1];
        $sql = "INSERT INTO " . DB_PIZZA . " VALUES(NULL, NULL, ?, ?)";
        $hashPizza = $this->insert($sql, 'ss', array($nome, $prezzo), DB_PIZZA);
        //Reperisco l'id della nuova pizza mediante l'idHash
        $sql = "SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?";
        $idPizza = $this->select($sql, array($hashPizza))[0]['ID'];
        //Ora inserisco gli ingredienti
        $ingredientiXML = $pizzaXML->ingrediente;
        for($i = 0; $i < $ingredientiXML->count(); $i++){
            $ingredienteXML = $ingredientiXML[$i];
            $hash = $ingredienteXML->attributes()[0];

            $sql = "INSERT INTO " . DB_PIZZAAGGIUNTA . " VALUES(NULL, (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?), ?)";
            $this->executeStatement($sql, 'ss', array($hash, $idPizza));    //Perché la relativa tabella non ha la colonna ID_HASH
        }
    }

    public function edit($xml, $hash){
        $pizzaXML = $xml->pizza[0];
        $nome = $pizzaXML->attributes()[0];
        $this->checkNomePizzaPresente($nome, $hash);
        $this->checkPizzaPrenotazioneSuccessive($hash);
        //Ora modifico la pizza
        $prezzo = $pizzaXML->attributes()[1];
        $sql = "UPDATE ". DB_PIZZA . " SET " . DB_PIZZA_NOME . " = ?, " . DB_PIZZA_PREZZO . " = ? WHERE ID_HASH = ?";
        $this->executeStatement($sql, 'sss', array($nome, $prezzo, $hash));
        //Ora elimino tutti gli ingredienti della pizza; ma prima prendo l'id della pizza
        $sql = "SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?";
        $idPizza = $this->select($sql, array($hash))[0]['ID']; 
        
        $sql = "DELETE FROM ". DB_PIZZAAGGIUNTA . " WHERE ". DB_PIZZAAGGIUNTA_IDPIZZA . " = ?";
        $this->delete($sql, 's', array($idPizza));
        //Ora inserisco i nuovi ingredienti
        $ingredientiXML = $pizzaXML->ingrediente;
        for($i = 0; $i < $ingredientiXML->count(); $i++){
            $ingredienteXML = $ingredientiXML[$i];
            $hash = $ingredienteXML->attributes()[0];

            $sql = "INSERT INTO " . DB_PIZZAAGGIUNTA . " VALUES(NULL, (SELECT ID FROM " . DB_AGGIUNTA . " WHERE ID_HASH = ?), ?)";
            $this->executeStatement($sql, 'ss', array($hash, $idPizza));    //Perché la relativa tabella non ha la colonna ID_HASH
        }
    }


    public function deleteByHash($pizzaHash){
        $this->checkPizzaPrenotazioneSuccessive($pizzaHash);
        //Ok, non ha dato errore il check sulle prenotazioni; devo però prima cancellare le N-N con le aggiunte
        $sql = "DELETE FROM " . DB_PIZZAAGGIUNTA . " WHERE " . DB_PIZZAAGGIUNTA_IDPIZZA . " IN (SELECT ID FROM ". DB_PIZZA ." WHERE ID_HASH = ?)";
        $this->delete($sql, 's', array($pizzaHash));
        //Ora posso cancellare la pizza
        $sql = "DELETE FROM " . DB_PIZZA . " WHERE ID_HASH = ?";
        $this->delete($sql, 's', array($pizzaHash));
    }

    /**
     * Questa funzione serve a controllare che la pizza che il pizzaiolo sta provando a modificare (intesi i suoi ingredienti)
     * o a eliminare, non sia presente in prenotazioni successive alla data odierna 
     */
    private function checkPizzaPrenotazioneSuccessive($hashPizza = ""){
        $sql = "SELECT * FROM " . DB_PRENOTAZIONE ." WHERE DATA_AVVENIMENTO >= CURDATE() AND ID IN (SELECT ID_PRENOTAZIONE FROM ". DB_ORDINE . " WHERE ID_PIZZA = (SELECT ID FROM ". DB_PIZZA ." WHERE ID_HASH = ?))";
        $res = $this->select($sql, array($hashPizza));
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Ci sono delle prenotazioni che hanno ordinato questa pizza\" />";
            exit;
        }
    }

    private function checkNomePizzaPresente($nome, $hash){
        $sql = "SELECT * FROM " . DB_PIZZA . " WHERE " . DB_PIZZA_NOME . " = ?";
        $array = array($nome);
        if($hash != null){
            $sql .= " AND ID_HASH != ?"; 
            array_push($array, $hash);
        }
        $res = $this->select($sql, $array);
        if(!empty($res)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Vi è già una pizza col nome ".$nome."\" />";
            exit;
        }
    }
}

?>