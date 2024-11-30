<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/PrenotazioneModel.php";

class PrenotazioneController extends BaseController{
    private PrenotazioneModel $prenotazioneModel;

    public function __construct(){
        $this->prenotazioneModel = new PrenotazioneModel();
    }

    /**
     * End-point /prenotazione/all
     * @return void
     */
    public function all(): void{
        $this->validaMetodi("GET");

        try{
            $this->validaParametri(null, null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $cookie = $_COOKIE["usrcok"];
            if(!$cookie){
                header(HTTP_V." 400 Bad Request");
                echo "La pizza richiesta non esiste";
                exit;
            }
            $userid = "";
            $res = $this->prenotazioneModel->getAllByUserID($userid);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function allfilter(): void{
        $this->validaMetodi("GET");
        try{
            #$this->validaParametri(null, null);
            $this->validaParametriArbitrari("/(tipoaggiunta)|(pizza)|(allergene\d)/");
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $idHashTipoAggiunta = $_GET["tipoaggiunta"];
            if(!$idHashTipoAggiunta){
                header(HTTP_V." 400 Bad Request");
                echo "La pizza richiesta non esiste";
                exit;
            }
            $idHashPizza = $_GET["pizza"];
            $idHashAllergeni = array();
            foreach($_GET as $key => $value){
                if(preg_match("/allergene\d/", $key)){
                    array_push($idHashAllergeni, $value);
                }
            }
            $res = $this->aggiuntaModel->getAllByTipoAggiuntaExceptByPizzaAndAllergeni($idHashTipoAggiunta, $idHashPizza, $idHashAllergeni);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);  
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}

?>