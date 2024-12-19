<?php

// include the base controller file
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

    public function getBozzaByUserID($userid, $idHashPrenotazione = ""){
        $sql = "SELECT ID_HASH, " . DB_PRENOTAZIONE_NOME . ", " . DB_PRENOTAZIONE_DATAPRENOTAZIONE . ", " .
                        DB_PRENOTAZIONE_DATAAVVENIMENTO . ", " . DB_PRENOTAZIONE_STATO . ", " . DB_PRENOTAZIONE_IDTAVOLO . ", " . 
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
        if($asporto){
            $asporto = '1';
        }else{
            $asporto = '0';
        }
        $numero_persone = $xml->numero_persone[0]->attributes()[0];
        $telefono = $xml->telefono[0]->attributes()[0];
        $data = $xml->data[0]->attributes()[0];
        $nominativo = $xml->nome[0]->attributes()[0];
        $sql = "INSERT INTO " . DB_PRENOTAZIONE . " VALUES (NULL, NULL, ?, (SELECT CURDATE()), ?, " . PRENOTAZIONE_STATO_BOZZA . ", NULL, ?, ?, " . 
                DESCRIZIONE_PRENOTAZIONE_STATO_BOZZA . ", ?, ?)";  
        $res = $this->insert($sql, "ssssss",  array($nominativo, $data, $numero_persone, $asporto, $userid, $telefono), DB_PRENOTAZIONE);
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

        $sql = "UPDATE " . DB_PRENOTAZIONE . " SET " .
                    DB_PRENOTAZIONE_NOME . " = ?, " .
                    DB_PRENOTAZIONE_DATAAVVENIMENTO . " = ?, " .
                    DB_PRENOTAZIONE_NUMEROPERSONE . " = ?, " .
                    DB_PRENOTAZIONE_TIPO . " = ?, " .
                    DB_PRENOTAZIONE_TELEFONO . " = ?" . 
                    " WHERE " . DB_PRENOTAZIONE_USERID . " = ? AND ID_HASH = ?";
        $this->insert($sql, "sssssss", array($nominativo, $data, $numero_persone, $asporto, $telefono, $userid, $hash), DB_PRENOTAZIONE);
    }

    public function removeByIdHash($idHash = ""){
        $this->ordineModel->removeAllByIdHashPrenotazione($idHash);
        $sql = "DELETE FROM " . DB_PRENOTAZIONE . " WHERE ID_HASH = ? ";
        $this->delete($sql, 's', array($idHash)); 
    }
}

?>