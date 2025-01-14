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
     * Se questa API non riceve alcun parametro 'prenotazione', vuole in risposta la prossima disponibile.
     * Altrimenti ritorna quella richiesta.
     * Il parametro viene inoltrato quando la rispettiva pagina viene invocata tramite tasto modifica presente per ogni prenotazione in bozza nell storico
     * @return void
     */
    public function continua(){
        $this->validaMetodi(array("GET"));
        try{
            $this->validaParametri(null, array("prenotazione"));
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $userid = controllaCookie(COOKIE_NAME);
            $hash = "";
            if(filter_has_var(INPUT_GET, "prenotazione")){
                $hash = $_GET['prenotazione'];
            }
            $res = $this->prenotazioneModel->getBozzaByUserID($userid, $hash);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

        /**
     * End-point /prenotazione/prenotazione
     * @return void
     */
    public function prenotazione(){
        $this->validaMetodi(array("DELETE", "GET", "POST", "PUT"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        try{
            if($metodo == 'DELETE'){
                $this->validaParametri(array("prenotazione"), null);
            }else if($metodo == 'GET'){
                $this->validaParametri(null, array('date', 'asporto'));
            }else if($metodo == 'POST'){
                $this->validaParametri(null, null);
            }else if($metodo == 'PUT'){
                $this->validaParametri(array("prenotazione"), null);
            }
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            if($metodo == 'DELETE'){
                $userid = controllaCookie(COOKIE_NAME);
                $hash = $_GET['prenotazione'];
                $this->prenotazioneModel->removeByIdHash($hash);
            }else if($metodo == 'GET'){
                $res = "";
                if(filter_has_var(INPUT_GET, "date") && filter_has_var(INPUT_GET, 'asporto')){
                    //Vuol dire che è un cameriere o un pizzaiolo, devo controllare la sessione
                    controllaSessione(array(RUOLO_CAMERIERE, RUOLO_PIZZAIOLO));
                    $res = $this->prenotazioneModel->getAllByDataAvvenimento($_GET['date'], $_GET['asporto']);
                }else{
                    //È un cliente
                    $userid = controllaCookie(COOKIE_NAME);
                    $res = $this->prenotazioneModel->getAllByUserID($userid);
                }
                $res_xml = $this->res_to_xml($res);
                $this->inviaRispostaOK($res_xml);   
                exit;
            }else{
                $userid = controllaCookie(COOKIE_NAME);
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                if($metodo == 'POST'){
                    $res_xml = $this->prenotazioneModel->save($xml, $userid);
                    $this->inviaRispostaOK($res_xml);  
                }else if($metodo == 'PUT'){
                    $hash = $_GET['prenotazione'];
                    $this->prenotazioneModel->update($xml, $hash,  $userid);
                }
            }

            $this->inviaRispostaOK("");   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}

?>