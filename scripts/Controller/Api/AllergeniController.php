<?php

// include the base controller file
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
// include the base controller file
require_once PROJECT_ROOT_PATH . "/Model/AllergeneModel.php";

require_once PROJECT_ROOT_PATH . "/utils/SessionUtils.php";

class AllergeniController extends BaseController{

    private AllergeneModel $allergeneModel;

    public function __construct(){
        $this->allergeneModel = new AllergeneModel();
    }


    public function allergene(){
        $this->validaMetodi(array("POST", "PUT", "DELETE", "GET"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        try{
            if($metodo != 'GET'){
                controllaSessione();
            }

            if($metodo == 'POST'){
                $this->validaParametri(null, null);
            }else if($metodo == 'PUT' || $metodo == 'DELETE'){
                $this->validaParametri(array("hash"), null);
            }else if($metodo == 'GET'){
                $this->validaParametri(null, array('aggiunta'));
            }
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $res = "";
            if($metodo == 'DELETE'){
                $idHashAllergene = $_GET["hash"];
                $this->allergeneModel->remove($idHashAllergene);
            }else if($metodo == 'GET'){
                $res = null;
                if(!filter_has_var(INPUT_GET, 'aggiunta')){
                    $res = $this->allergeneModel->getAll();
                }else{
                    $hashAggiunta = $_GET['aggiunta'];
                    $res = $this->allergeneModel->getAllByAggiunta($hashAggiunta);
                }
                $res_xml = $this->res_to_xml($res);
                $this->inviaRispostaOK($res_xml);   
                exit;
            }else{
                //Prelevo il file xml
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                if($metodo == 'PUT'){
                    $idHashAggiunta = $_GET["hash"];
                    $this->allergeneModel->edit($idHashAggiunta, $xml);
                }else if($metodo == 'POST'){
                    $this->allergeneModel->save($xml);
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