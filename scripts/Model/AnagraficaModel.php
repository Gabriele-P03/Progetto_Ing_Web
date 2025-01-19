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
            echo "<results value=\"Credenziali non valide\" />";
            exit;
        }
    }

    public function resetPassword(SimpleXMLElement $xml){
        $nomeUtente = $xml->username[0]->attributes()[0];
        $password = $xml->password[0]->attributes()[0];
        $password = hash("sha512", $password);

        $newpassword1 = $xml->newpsw1[0]->attributes()[0];
        //Controllo nuova password
        $this->controllaNuovaPassword($newpassword1);
        $newpassword1 = hash("sha512", $newpassword1);

        $newpassword2 = $xml->newpsw2[0]->attributes()[0];
        $newpassword2 = hash("sha512", $newpassword2);

        if($newpassword1 !== $newpassword2){
            header(HTTP_V. " 400 Bad Request");
            echo "<result value=\"La nuova password non corrisponde con quella ripetuta\" />";
            exit;
        }
        
        $sql = "UPDATE " . DB_ANAGRAFICA . " SET " . DB_ANAGRAFICA_PASSWORD . " = ? WHERE " . DB_ANAGRAFICA_USERNAME . " = ? AND " . DB_ANAGRAFICA_PASSWORD . " = ?";
        return $this->executeStatement($sql, "sss", array($newpassword1, $nomeUtente, $password));
    }

    private function controllaNuovaPassword($password){
        $error = "";
        if(!preg_match('/[A-Z]{1,}/', $password)){
            $error = "La nuova password deve contenere almeno un carattere maiuscolo";
        }
        if(!preg_match('/[0-9]{1,}/', $password)){
            $error = "La nuova password deve contenere almeno una cifra";
        }
        if(!preg_match('/[@&$_#]{1,}/', $password)){
            $error = "La nuova password deve contenere almeno un carattere speciale tra ('@', '&amp;', '$', '_', '#')";
        }
        if(strlen($password) < 8){
            $error = "La nuova password deve contenere almeno 8 caratteri";
        }
        if(!empty($error)){
            header(HTTP_V." 400 Bad Request");
            echo "<results value=\"".$error."\" />";
            exit;
        }
    }
}

?>