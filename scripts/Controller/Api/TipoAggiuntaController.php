<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/TipoAggiuntaModel.php";

class TipoAggiuntaController extends BaseController{
    private TipoAggiuntaModel $tipoAggiuntaModel;

    public function __construct(){
        $this->tipoAggiuntaModel = new TipoAggiuntaModel();
    }

    public function tipoaggiunta(){
        $this->validaMetodi(array("PUT", "DELETE", "POST", "GET"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        if($metodo != 'GET'){
            controllaSessione();
        }
        try{
            if($metodo == 'PUT' || $metodo == 'DELETE'){
                $this->validaParametri(array('hash'), null);
            }else{
                //Post e getall non hanno bisogno di parametri
                $this->validaParametri(null, null);
            }
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            if($metodo == 'PUT'){
                $hash = $_GET['hash'];
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                $res = $this->tipoAggiuntaModel->edit($hash, $xml);
            }else if($metodo == 'DELETE'){
                $hash = $_GET['hash'];
                $this->tipoAggiuntaModel->remove($hash);
                $res = "";
            }else if($metodo == 'POST'){
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                $this->tipoAggiuntaModel->save($xml);
                $res = "";
            }else if($metodo == 'GET'){
                $res = $this->tipoAggiuntaModel->getAll();
                $res_xml = $this->res_to_xml($res);
                $this->inviaRispostaOK($res_xml);  
                exit;
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