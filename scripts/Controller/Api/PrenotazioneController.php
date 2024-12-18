<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/PrenotazioneModel.php";
require_once PROJECT_ROOT_PATH . "/utils/CookieUtils.php";

class PrenotazioneController extends BaseController{
    private PrenotazioneModel $prenotazioneModel;

    public function __construct(){
        $this->prenotazioneModel = new PrenotazioneModel();
    }

    /**
     * End-point /prenotazione/continua
     * @return void
     */
    public function continua(){
        $this->validaMetodi("GET");
        try{
            $this->validaParametri(null, null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $userid = controllaCookie(COOKIE_NAME);
            $res = $this->prenotazioneModel->getBozzaByUserID($userid);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    /**
     * End-point /prenotazione/all
     * @return void
     */
    public function all(){
        $this->validaMetodi("GET");

        try{
            $this->validaParametri(null, null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $userid = controllaCookie(COOKIE_NAME);
            $res = $this->prenotazioneModel->getAllByUserID($userid);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function save(){
        $this->validaMetodi(array("PUT", "POST"));
        try{
            $this->validaParametri(null, array("prenotazione"));
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $userid = controllaCookie(COOKIE_NAME);

            header('Content-Type: application/xml; charset=utf-8');
            $xmlString = file_get_contents('php://input');
            $xml = new SimpleXMLElement($xmlString);

            $method = $_SERVER["REQUEST_METHOD"];
            $res = "";
            if($method == 'POST'){
                $res = $this->prenotazioneModel->save($xml, $userid);
            }else{
                $hash = $_GET['prenotazione'];
                $this->prenotazioneModel->update($xml, $hash,  $userid);
            }
            $this->inviaRispostaOK($res);  
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

        /**
     * End-point /prenotazione/all
     * @return void
     */
    public function delete(){
        $this->validaMetodi("DELETE");

        try{
            $this->validaParametri(array("prenotazione"), null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $userid = controllaCookie(COOKIE_NAME);
            $hash = $_GET['prenotazione'];
            $this->prenotazioneModel->removeByIdHash($hash);
            $this->inviaRispostaOK("");   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}

?>