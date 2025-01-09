<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/AnagraficaModel.php";
require_once PROJECT_ROOT_PATH . "/Model/RuoloModel.php";

require_once PROJECT_ROOT_PATH . "/utils/SessionUtils.php";

class AnagraficaController extends BaseController{
    private AnagraficaModel $anagraficaModel;
    private RuoloModel $ruoloModel;

    public function __construct(){
        $this->anagraficaModel = new AnagraficaModel();
        $this->ruoloModel = new RuoloModel();
    }

    /**
     * End-point /aggiunta?pizza=idhashpizza
     * @return void
     */
    public function login(): void{
        $this->validaMetodi(array("POST", "PUT"));
        if($_SERVER['REQUEST_METHOD'] != 'POST'){
            controllaSessione();
        }
        try{
            $this->validaParametri(null, null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{

            //Prelevo il file xml
            header('Content-Type: application/xml; charset=utf-8');
            $xmlString = file_get_contents('php://input');
            $xml = new SimpleXMLElement($xmlString);

            $res_xml = null;
            if($_SERVER["REQUEST_METHOD"] == 'POST'){
                $res = $this->anagraficaModel->getByUsernameAndPassword($xml);

                //Salvo e poi rimuovo, per motivi di sicurezza, l'id del ruolo
                $idRuolo = $res[0][DB_ANAGRAFICA_IDRUOLO];
                unset($res[0][DB_ANAGRAFICA_IDRUOLO]);

                $res_xml = $this->res_to_xml($res);
                //Adesso al res_xml aggiungo anche un child col ruolo
                $resRuolo = $this->ruoloModel->getByIdentificativoRuolo($idRuolo);
                if($res_xml != null){
                    $username = $xml->username[0]->attributes()[0]->__toString();
                    $xml = new SimpleXMLElement($res_xml);
                    $ruoloChild = $xml->row[0]->addChild('RUOLO');
                    $ruolo = $resRuolo[0][DB_RUOLO_NOME];                
                    $ruoloChild->addChild('NOME', $ruolo);
                    //Ora aggiungo l'identificativo della sessione
                    $idSession = generaSessionID($ruolo, $username);
                    $xml->row[0]->addChild("ID", $idSession);
                    $res_xml = $xml->asXML();
                }else{
                    header(HTTP_V." 505 Internal Server Error");
                    echo "<results value=\"Nessun ruolo associato\" />";
                    exit;
                }
            }else if($_SERVER["REQUEST_METHOD"] == 'PUT'){
                //Reset della password
                //Prima controllo che username e oldpassword siano corretti
                $res = $this->anagraficaModel->getByUsernameAndPassword($xml); //Sfrutto la funzione già presente
                $res = $this->anagraficaModel->resetPassword($xml);
                if($res){
                    $res_xml = "<result value=\"OK\" />";
                }
            }
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}

?>