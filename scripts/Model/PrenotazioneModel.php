<?php

// include the base controller file
require_once __DIR__ . "/../inc/config.php";
require_once __DIR__ . "/Connection.php";
require_once __DIR__ . "/OrdineModel.php";

class PrenotazioneModel extends Connection{

    private OrdineModel $ordineModel;

    public function __construct(){
        parent::__construct();
        $this->ordineModel = new OrdineModel();
    }

    public function getAllByUserID($userid){
        $sql = "SELECT ID_HASH, " . DB_PRENOTAZIONE_NOME . " AS Nome, " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . " AS 'Data_Prenotazione', " .
                        DB_PRENOTAZIONE_DATAAVVENIMENTO . " AS 'Data_Avvenimento', " . DB_PRENOTAZIONE_STATO . " Stato, " . 
                        DB_PRENOTAZIONE_NUMEROPERSONE . " AS Persone, " . DB_PRENOTAZIONE_TIPO . " AS Tipo, " . DB_PRENOTAZIONE_DESCRIZIONESTATO . " Informazioni, ". 
                        DB_PRENOTAZIONE_TELEFONO . " AS Telefono FROM " . DB_PRENOTAZIONE . " WHERE " . DB_PRENOTAZIONE_USERID . " = ? 
                        ORDER BY " . DB_PRENOTAZIONE_DATAAVVENIMENTO;
        return $this->select($sql, array($userid));
    }

    public function getAllByDataAvvenimento($data, $asporto){
        $sql = "SELECT ID_HASH, " . DB_PRENOTAZIONE_NOME . " AS Nome, " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . " AS 'Data_Prenotazione', " .
        DB_PRENOTAZIONE_DATAAVVENIMENTO . " AS 'Data_Avvenimento', " . DB_PRENOTAZIONE_STATO . " Stato, " . 
        DB_PRENOTAZIONE_NUMEROPERSONE . " AS Persone, " . DB_PRENOTAZIONE_TIPO . " AS Tipo, " . DB_PRENOTAZIONE_DESCRIZIONESTATO . " Informazioni, ". 
        DB_PRENOTAZIONE_TELEFONO . " AS Telefono, " . DB_PRENOTAZIONE_IDTAVOLO . " AS Tavolo FROM " . DB_PRENOTAZIONE . " WHERE " . DB_PRENOTAZIONE_DATAAVVENIMENTO . " = ?";
        if(!$asporto){
            $sql .= " AND " . DB_PRENOTAZIONE_TIPO ." = " . PRENOTAZIONE_TIPO_TAVOLO;
        } 
        $sql .= " ORDER BY " . DB_PRENOTAZIONE_DATAAVVENIMENTO;
        
        return $this->select($sql, array($data));
    }

    public function getBozzaByUserID($userid, $idHashPrenotazione = ""){
        $sql = "SELECT ID_HASH, " . DB_PRENOTAZIONE_NOME . ", " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . ", " .
                        DB_PRENOTAZIONE_DATAAVVENIMENTO . ", " . DB_PRENOTAZIONE_STATO . ", " . 
                        DB_PRENOTAZIONE_NUMEROPERSONE . ", " . DB_PRENOTAZIONE_TIPO . ", " . DB_PRENOTAZIONE_DESCRIZIONESTATO . ", ". 
                        DB_PRENOTAZIONE_TELEFONO . " FROM " . DB_PRENOTAZIONE . " WHERE " . DB_PRENOTAZIONE_USERID . " = ? AND " . 
                        DB_PRENOTAZIONE_STATO . " = " . PRENOTAZIONE_STATO_BOZZA . " AND ";
        $arr = array($userid);
        if(!empty( $idHashPrenotazione )){
            $sql .= "ID_HASH = ? LIMIT 1";
            $arr[] = $idHashPrenotazione;   //Aggiungo l'hash della prenotazione
        }else{
            $sql .= DB_PRENOTAZIONE_DATAAVVENIMENTO . " >= (SELECT CURDATE())" . " ORDER BY " . DB_PRENOTAZIONE_DATAAVVENIMENTO . " LIMIT 1";
        }
        return $this->select($sql, $arr);
    }

    public function save($xml, $userid){
        $asporto = $xml->asporto[0]->attributes()[0];
        $idTavolo = null;
        $numero_persone = $xml->numero_persone[0]->attributes()[0];
        $telefono = $xml->telefono[0]->attributes()[0];
        $data = $xml->data[0]->attributes()[0];
        $nominativo = $xml->nome[0]->attributes()[0];
        if($asporto == "true"){
            $asporto = '1';
        }else{
            $asporto = '0';
            $idTavolo = $this->manageTavolo($numero_persone, $data);
        }
        $sql = "INSERT INTO " . DB_PRENOTAZIONE . " VALUES (NULL, NULL, ?, (SELECT CURDATE()), ?, " . PRENOTAZIONE_STATO_BOZZA . ", NULL, ?, ?, " . 
                DESCRIZIONE_PRENOTAZIONE_STATO_BOZZA . ", ?, ?)";  
        $res = $this->insert($sql, "ssssss",  array($nominativo, $data, $numero_persone, $asporto, $userid, $telefono), DB_PRENOTAZIONE);
        if($asporto == '0'){
            $this->setTavolo($idTavolo, $res);
        }
        return "<results xmlns=\"http://www.w3.org/1999/xhtml\"><digest value=\"" . $res . "\"/></results>";
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
        $idTavolo = null;
        if($asporto == '0'){
            $idTavolo = $this->manageTavolo($numero_persone, $data); 
        }

        $sql = "UPDATE " . DB_PRENOTAZIONE . " SET " .
                    DB_PRENOTAZIONE_NOME . " = ?, " .
                    DB_PRENOTAZIONE_DATAAVVENIMENTO . " = ?, " .
                    DB_PRENOTAZIONE_NUMEROPERSONE . " = ?, " .
                    DB_PRENOTAZIONE_TIPO . " = ?, " .
                    DB_PRENOTAZIONE_TELEFONO . " = ?, " . 
                    DB_PRENOTAZIONE_IDTAVOLO . " = ? " .
                    "WHERE " . DB_PRENOTAZIONE_USERID . " = ? AND ID_HASH = ?";
        $this->insert($sql, "ssssssss", array($nominativo, $data, $numero_persone, $asporto, $telefono, $idTavolo, $userid, $hash), DB_PRENOTAZIONE);
    }

    public function removeByIdHash($idHash = ""){
        $this->ordineModel->removeAllByIdHashPrenotazione($idHash);
        $sql = "DELETE FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ? ";
        $this->delete($sql, 's', array($idHash)); 
    }

    private function manageTavolo($numero_persone, $data){
        $idTavolo = $this->getTavoloDisponibile($numero_persone, $data);
        if($idTavolo == null){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"Non abbiamo un tavolo disponibile per " . $numero_persone ." per questa data\" />";
            exit;
        }
        return $idTavolo;
    }

    //Gestione dei tavoli
    private function getTavoloDisponibile($numero_persone, $data){
        $sql = "SELECT * FROM " . DB_TAVOLO . " WHERE " . DB_TAVOLO_POSTI . " >= ? AND ID NOT IN (SELECT ID_TAVOLO FROM " . DB_PRENOTAZIONE ." WHERE " 
        . DB_PRENOTAZIONE_DATAAVVENIMENTO .  " = ? AND " . DB_PRENOTAZIONE_STATO . " != " . PRENOTAZIONE_STATO_ELIMINATO . " AND " . DB_PRENOTAZIONE_IDTAVOLO . " != NULL) ORDER BY " . DB_TAVOLO_POSTI . " LIMIT 1";

        $res = $this->select($sql, array($numero_persone, $data));  
        if(empty($res))
            return null;
        return $res[0]["ID"];
    }


    private function setTavolo($idTavolo, $hashPrenotazione){
        $sql = "UPDATE " . DB_PRENOTAZIONE . " SET " . DB_PRENOTAZIONE_IDTAVOLO . " = ? WHERE ID_HASH = ?";
        $this->executeStatement($sql, "ss", array($idTavolo, $hashPrenotazione));
    }
}

?>