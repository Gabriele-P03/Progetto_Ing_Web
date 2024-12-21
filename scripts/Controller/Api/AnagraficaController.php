<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/AnagraficaModel.php";
require_once PROJECT_ROOT_PATH . "/Model/RuoloModel.php";

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
        $this->validaMetodi("POST");

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
            $res = $this->anagraficaModel->getByUsernameAndPassword($xml);

            //Salvo e poi rimuovo, per motivi di sicurezza, l'id del ruolo
            $idRuolo = $res[0][DB_ANAGRAFICA_IDRUOLO];
            unset($res[0][DB_ANAGRAFICA_IDRUOLO]);

            $res_xml = $this->res_to_xml($res);
            //Adesso al res_xml aggiungo anche un child col ruolo
            $resRuolo = $this->ruoloModel->getByIdentificativoRuolo($idRuolo);
            if($res_xml != null){
                $xml = new SimpleXMLElement($res_xml);
                $ruoloChild = $xml->row[0]->addChild('RUOLO');
                $ruoloChild->addChild('NOME', $resRuolo[0][DB_RUOLO_NOME]);
                $res_xml = $xml->asXML();
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