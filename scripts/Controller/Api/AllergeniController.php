<?php

// include the base controller file
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
// include the base controller file
require_once PROJECT_ROOT_PATH . "/Model/AllergeneModel.php";

class AllergeniController extends BaseController{

    private AllergeneModel $allergeneModel;

    public function __construct(){
        $this->allergeneModel = new AllergeneModel();
    }

    /**
     * End-point /allergene
     * @return void
     */
    public function all(): void{
        $this->validaMetodi(array("GET"));

        try{
            $this->validaParametri(null, array('aggiunta'));
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $res = null;
            if(!filter_has_var(INPUT_GET, 'aggiunta')){
                $res = $this->allergeneModel->getAll();
            }else{
                $hashAggiunta = $_GET['aggiunta'];
                $res = $this->allergeneModel->getAllByAggiunta($hashAggiunta);
            }
            
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function allergene(){
        $this->validaMetodi(array("POST", "PUT", "DELETE"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        try{
            if($metodo == 'POST'){
                $this->validaParametri(null, null);
            }else if($metodo == 'PUT' || $metodo == 'DELETE'){
                $this->validaParametri(array("hash"), null);
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