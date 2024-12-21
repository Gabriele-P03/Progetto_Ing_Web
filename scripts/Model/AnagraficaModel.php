<?php

// include the base controller file
require_once __DIR__ . "/Connection.php";

class AnagraficaModel extends Connection{

    public function __construct(){
        parent::__construct();
    }

    public function getByUsernameAndPassword(SimpleXMLElement $xml){
        $nomeUtente = $xml->username[0]->attributes()[0];
        $password = $xml->password[0]->attributes()[0];
        $password = hash('sha512', $password);
        $sql = 'SELECT ' . DB_ANAGRAFICA_NOME . ', ' . DB_ANAGRAFICA_COGNOME . ', ' . DB_ANAGRAFICA_USERNAME . ', ' . DB_ANAGRAFICA_IDRUOLO . ' FROM ' . DB_ANAGRAFICA . " WHERE " . DB_ANAGRAFICA_USERNAME . " = ? AND " . DB_ANAGRAFICA_PASSWORD . " = ?";
        $res = $this->select($sql, array($nomeUtente, $password));
        if(!empty($res)){
            return $res;
        }else{
            header(HTTP_V. " 401 Unauthorized");
            echo "<results status=\"Credenziali non valide\" />";
            exit;
        }
    }
}

?>