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

    /**
     * Modificare esplicitamente un ordine vorrebbe dire andare a vedere singolarmente le variazioni - che siano di allergeni, aggiunte o pizze - rispetto
     * alla versione antecedente; troppe select ed eventuali update da fare, oltre che un dispendio a livello di codice.
     * Per ovviare, preferisco eliminare tutto quello che concerne la vecchia versione dell'ordine (nella sua interezza) e creo la nuova
     */
    public function update($xml, $hash, $userid){
        //Conservo l'idHash della prenotazione alla quale era collegata la vecchia versione dell'ordine che sto per "sovrascrivere"
        $sqlGetHashPrenotazionePreDelete = "SELECT ID_HASH FROM " . DB_PRENOTAZIONE . " WHERE ID IN (SELECT " . DB_ORDINE_IDPRENOTAZIONE . " FROM " . DB_ORDINE . " WHERE ID_HASH = ?)";
        $res = $this->select($sqlGetHashPrenotazionePreDelete, array($hash));
        $hashPrenotazione = $res[0]['ID_HASH'];

        //Cancello i vecchi allergeni e le aggiunte
        $this->ordineAllergenModel->deleteByIdHashOrdine($hash);
        $this->ordineAggiuntaModel->deleteByIdHashOrdine($hash);
        //Cancello l'ordine
        $this->delete("DELETE FROM " . DB_ORDINE . " WHERE ID_HASH = ?", "s", array($hash));

        //Salvo la nuova versione
        $this->save($xml, $hashPrenotazione, $userid);
    }

    private function creaNuovoOrdine($idHashPizza = "" | null, $idHashPrenotazione = ""){
        $sql = "INSERT INTO " . DB_ORDINE . " VALUES(NULL, NULL, (SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?), (SELECT ID FROM " . DB_PIZZA . " WHERE ID_HASH = ?));";
        return $this->insert($sql, "ss", array($idHashPrenotazione, $idHashPizza), DB_ORDINE);
    }

    public function getAllByPrenotazione($idHashPrenozatione = ""){
        $sql = "SELECT * FROM " . DB_ORDINE . " WHERE " . DB_ORDINE_IDPRENOTAZIONE . " = (SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?)";
        $res = $this->select($sql, array($idHashPrenozatione));
        $xml = new SimpleXMLElement("<results />");

        $totale = 0.0;
        foreach ($res as $row) {
            
            $prezzo = 0.0;
            $ordineXML = $xml->addChild("ordine");

            $idOrdine = $row['ID'];

            //Scrivo l'hash dell'ordine
            $idHash = $row['ID_HASH'];
            $ordineXML->addAttribute('hash', $idHash);

            $idPizza = $row[DB_ORDINE_IDPIZZA];
            $xmlPizza = $ordineXML->addChild("pizza");
            if($idPizza !== null){
                $sqlPizza = "SELECT ID_HASH, " . DB_PIZZA_NOME . ", " . DB_PIZZA_PREZZO . " FROM " . DB_PIZZA . " WHERE ID = ?";
                $resPizza = $this->select($sqlPizza, array($idPizza));
                $xmlPizza->addAttribute("hash", $resPizza[0]["ID_HASH"]);
                $xmlPizza->addAttribute("value", $resPizza[0][DB_PIZZA_NOME]);
                $xmlPizza->addAttribute("th", true);
                $prezzo += $resPizza[0][DB_PIZZA_PREZZO];
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
            $allergieXML->addAttribute("th", true);

            $sqlAggiunte = "SELECT a.ID_HASH AS ID_HASH_AGGIUNTA, t.ID_HASH AS ID_HASH_TIPO_AGGIUNTA, " . DB_AGGIUNTA_NOME . ", " . DB_AGGIUNTA_PREZZO . ", " . DB_TIPOAGGIUNTA_ETICHETTA . " FROM " . DB_AGGIUNTA . " a, " . DB_TIPOAGGIUNTA . " t WHERE a.ID_TIPO_AGGIUNTA = t.ID AND a.ID IN (SELECT " . DB_ORDINEAGGIUNTA_IDAGGIUNTA . " FROM " . DB_ORDINEAGGIUNTA . " WHERE " . DB_ORDINEAGGIUNTA_IDORDINE . " = ?)";
            
            $resAggiunte = $this->select($sqlAggiunte, array($idOrdine));
            foreach ($resAggiunte as $rowAggiunta) {

                //Prima controllo che il tipo aggiunta non sia stato già inserito, altrimenti lo creo
                $nomeTipoAggiunta = $rowAggiunta[DB_TIPOAGGIUNTA_ETICHETTA];
                $tipoaggiuntaXML = null;
                if( !isset($ordineXML->$nomeTipoAggiunta) ){
                    $tipoaggiuntaXML = $ordineXML->addChild($nomeTipoAggiunta);
                    $tipoaggiuntaXML->addAttribute("hash", $rowAggiunta['ID_HASH_TIPO_AGGIUNTA']);
                    $tipoaggiuntaXML->addAttribute('ul', true);
                    $tipoaggiuntaXML->addAttribute('th', true);
                }else{
                    $tipoaggiuntaXML = $ordineXML->$nomeTipoAggiunta;
                }
                $aggiuntaXML = $tipoaggiuntaXML->addChild("aggiunta");
                $aggiuntaXML->addAttribute("hash", $rowAggiunta['ID_HASH_AGGIUNTA']);
                $aggiuntaXML->addAttribute('value', $rowAggiunta[DB_AGGIUNTA_NOME]);
                $aggiuntaXML->addAttribute('ul', false);
                $prezzo += $rowAggiunta[DB_AGGIUNTA_PREZZO];
            }

            $ordineXML->addAttribute("prezzo", $prezzo);
            $totale += $prezzo;
        }
        $xml->addAttribute("totale", $totale);
        return $xml;
        
    }

    public function remove($idHashOrdine = ""){
        $this->ordineAllergenModel->deleteByIdHashOrdine($idHashOrdine);
        $this->ordineAggiuntaModel->deleteByIdHashOrdine($idHashOrdine);
        
        $sql = "DELETE FROM " . DB_ORDINE . " WHERE ID_HASH = ?";
        $this->delete($sql, "s", array($idHashOrdine));
    }

    public function removeAllByIdHashPrenotazione($idHashPrenotazione = ""){

        //Cancello tutte le relazione create per le aggiunte
        $sql = "DELETE FROM " . DB_ORDINEAGGIUNTA . " WHERE " . DB_ORDINEAGGIUNTA_IDORDINE . " IN ( SELECT ID FROM " . DB_ORDINE ." WHERE " . DB_ORDINE_IDPRENOTAZIONE . " IN ( SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?))";
        $this->delete($sql, "s", array($idHashPrenotazione));

        //Cancello tutte le relazione create per gli allergeni
        $sql = "DELETE FROM " . DB_ORDINEALLERGENE . " WHERE " . DB_ORDINEALLERGENE_IDORDINE . " IN ( SELECT ID FROM " . DB_ORDINE ." WHERE " . DB_ORDINE_IDPRENOTAZIONE . " IN ( SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?))";
        $this->delete($sql, "s", array($idHashPrenotazione));

        //Adesso posso cancellare tutti gli ordini
        $sql = "DELETE FROM " . DB_ORDINE . " WHERE " . DB_ORDINE_IDPRENOTAZIONE . " IN (SELECT ID FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ?)"; 
        $this->delete($sql, "s", array($idHashPrenotazione));
    }
}

?>