<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";
require_once __DIR__ . "/OrdineAllergeneModel.php";
require_once __DIR__ . "/OrdineAggiuntaModel.php";

class OrdineModel extends Connection{

    private OrdineAllergeneModel $ordineAllergenModel;
    private OrdineAggiuntaModel $ordineAggiuntaModel;

    public function __construct(){
        parent::__construct();
        $this->ordineAllergenModel = new OrdineAllergeneModel();
        $this->ordineAggiuntaModel = new OrdineAggiuntaModel();
    }

    public function save($xml, $hashPrenotazione, $userid):string{
        $pizza = $xml->pizza[0];
        if($pizza !== null){
            $pizza = $pizza->attributes()[0];
        }
        $idHashOrdine = $this->creaNuovoOrdine($pizza, $hashPrenotazione);

        //Salvo gli allergeni
        $allergeniArray = $xml->allergeni[0];
        foreach($allergeniArray as $key){
            $idHashAllergene = $key->attributes()[0];
            $this->ordineAllergenModel->save($idHashOrdine, $idHashAllergene);
        }

        $aggiunteArray = $xml->aggiunte[0];
        foreach($aggiunteArray as $key){
            foreach($key as $aggiunta){
                $idHashAggiunta = $aggiunta->attributes()[0];
                $this->ordineAggiuntaModel->save($idHashOrdine, $idHashAggiunta);
            }
        }

        return "<results xmlns=\"http://www.w3.org/1999/xhtml\"><digest value=\"" . $idHashOrdine . "\"/></results>";;
    }

    public function update($xml, $hash, $userid){
        $asporto = $xml->asporto[0]->attributes()[0];
        if($asporto == "true" || $asporto == "1"){
            $asporto = '1';
        }else{
            $asporto = '0';
        }
        $numero_persone = $xml->numero_persone[0]->attributes()[0];
        $telefono = $xml->telefono[0]->attributes()[0];
        $data = $xml->data[0]->attributes()[0];
        $nominativo = $xml->nome[0]->attributes()[0];

        $sql = "UPDATE " . DB_PRENOTAZIONE . " SET " .
                    DB_PRENOTAZIONE_NOME . " = ?, " .
                    DB_PRENOTAZIONE_DATAAVVENIMENTO . " = ?, " .
                    DB_PRENOTAZIONE_NUMEROPERSONE . " = ?, " .
                    DB_PRENOTAZIONE_TIPO . " = ?, " .
                    DB_PRENOTAZIONE_TELEFONO . " = ?" . 
                    " WHERE " . DB_PRENOTAZIONE_USERID . " = ? AND ID_HASH = ?";
        $this->insert($sql, "sssssss", array($nominativo, $data, $numero_persone, $asporto, $telefono, $userid, $hash), DB_PRENOTAZIONE);
    }

    private function creaNuovoOrdine($idHashPizza = "" | null, $idHashPrenotazione = ""){
        $sql = "INSERT INTO " . DB_ORDINE . " VALUES(NULL, NULL, (SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?), (SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?));";
        return $this->insert($sql, "ss", array($idHashPrenotazione, $idHashPizza), DB_ORDINE);
    }

    public function getAllByPrenotazione($idHashPrenozatione = ""){
        $sql = "SELECT * FROM " . DB_ORDINE . " WHERE " . DB_ORDINE_IDPRENOTAZIONE . " = (SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?)";
        $res = $this->select($sql, array($idHashPrenozatione));
        $xml = new SimpleXMLElement("<results />");

        foreach ($res as $row) {

            $ordineXML = $xml->addChild("ordine");

            $idOrdine = $row['ID'];

            //Scrivo l'hash dell'ordine
            $idHash = $row['ID_HASH'];
            $ordineXML->addAttribute('hash', $idHash);

            $idPizza = $row[DB_ORDINE_IDPIZZA];
            if($idPizza !== null){
                $xmlPizza = $ordineXML->addChild("pizza");
                $sqlPizza = "SELECT ID_HASH, " . DB_PIZZA_NOME . " FROM " . DB_PIZZA . " WHERE ID = ?";
                $resPizza = $this->select($sqlPizza, array($idPizza));
                $xmlPizza->addAttribute("hash", $resPizza[0]["ID_HASH"]);
                $xmlPizza->addAttribute("value", $resPizza[0][DB_PIZZA_NOME]);
                $xmlPizza->addAttribute("ul", false);
            }

            //Scrivo le allergie
            $allergieXML = $ordineXML->addChild("allergeni");
            $sqlAllergie = "SELECT ID_HASH, " . DB_ALLERGENE_ETICHETTA . " FROM " . DB_ALLERGENE . " WHERE ID IN (SELECT " . DB_ORDINEALLERGENE_IDALLERGENE . " FROM " . DB_ORDINEALLERGENE . " WHERE " . DB_ORDINEALLERGENE_IDORDINE . " = ?)";
            $resAllergie = $this->select($sqlAllergie, array($idOrdine));
            foreach ($resAllergie as $rowAllergie) {
                $allergeneXML = $allergieXML->addChild("allergene");
                $allergeneXML->addAttribute("hash", $rowAllergie["ID_HASH"]);
                $allergeneXML->addAttribute("value", $rowAllergie[DB_ALLERGENE_ETICHETTA]);
            }
            $allergieXML->addAttribute("ul", true);

            $aggiunteXML = $ordineXML->addChild("aggiunte");
            $sqlAggiunte = "SELECT a.ID_HASH AS ID_HASH_AGGIUNTA, t.ID_HASH AS ID_HASH_TIPO_AGGIUNTA, " . DB_AGGIUNTA_NOME . ", " . DB_AGGIUNTA_PREZZO . ", " . DB_TIPOAGGIUNTA_ETICHETTA . " FROM " . DB_AGGIUNTA . " a, " . DB_TIPOAGGIUNTA . " t WHERE a.ID_TIPO_AGGIUNTA = t.ID AND a.ID IN (SELECT " . DB_ORDINEAGGIUNTA_IDAGGIUNTA . " FROM " . DB_ORDINEAGGIUNTA . " WHERE " . DB_ORDINEAGGIUNTA_IDORDINE . " = ?)";
            
            $resAggiunte = $this->select($sqlAggiunte, array($idOrdine));
            foreach ($resAggiunte as $rowAggiunta) {

                //Prima controllo che il tipo aggiunta non sia stato già inserito, altrimenti lo creo
                $nomeTipoAggiunta = $rowAggiunta[DB_TIPOAGGIUNTA_ETICHETTA];
                $tipoaggiuntaXML = null;
                if( !isset($aggiunteXML->$nomeTipoAggiunta) ){
                    $tipoaggiuntaXML = $aggiunteXML->addChild($nomeTipoAggiunta);
                    $tipoaggiuntaXML->addAttribute("hash", $rowAggiunta['ID_HASH_TIPO_AGGIUNTA']);
                    $tipoaggiuntaXML->addAttribute('ul', true);
                }else{
                    $tipoaggiuntaXML = $aggiunteXML->$nomeTipoAggiunta;
                }
                $aggiuntaXML = $tipoaggiuntaXML->addChild("aggiunta");
                $aggiuntaXML->addAttribute("hash", $rowAggiunta['ID_HASH_AGGIUNTA']);
                $aggiuntaXML->addAttribute('value', $rowAggiunta[DB_AGGIUNTA_NOME]);
                $aggiuntaXML->addAttribute('ul', false);
            }
        }
        return $xml;
        
    }
}

?>