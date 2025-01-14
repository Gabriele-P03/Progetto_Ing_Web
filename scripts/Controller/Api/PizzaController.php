<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/PizzaModel.php";

class PizzaController extends BaseController{
    private PizzaModel $pizzaModel;

    public function __construct(){
        $this->pizzaModel = new PizzaModel();
    }


    /**
     * End-poin /pizza/allergene
     * @return void
     */
    public function allergeni(): void{
        $this->validaMetodi(array("GET"));
        try{
            $this->validaParametri(array("allergene0"), null);  //Per accertarmi che almeno un allergene sia arrivato
            $this->validaParametriArbitrari("/allergene\d/s");   //Mi potrei aspettare allergene0, allergene1 ....
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $idHashAllergeni = array();
            foreach($_GET as $key => $value){
                array_push($idHashAllergeni, $value);
            }
            $res = $this->pizzaModel->getAllFilterByAllergeni($idHashAllergeni);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function pizza(): void{
        $this->validaMetodi(array("DELETE", "POST", "PUT", "GET"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        if($metodo != 'GET'){
            controllaSessione(array(RUOLO_PIZZAIOLO));
        }
        try{
            if($metodo == 'DELETE' || $metodo == 'PUT')
                $this->validaParametri(array("hash"), null);
            else if($metodo == 'POST' || $metodo == 'GET'){
                $this->validaParametri(null, null);
            }
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        
        try{
            if($metodo == 'DELETE'){
                $this->pizzaModel->deleteByHash($_GET['hash']);
            }else if($metodo == 'GET'){
                $res = $this->pizzaModel->getAll();
                $res_xml = $this->res_to_xml($res);
                $this->inviaRispostaOK($res_xml); 
                exit;
            }else{ 
                //Prelevo il file xml
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                if($metodo == 'POST'){
                    $this->pizzaModel->save($xml);
                }else if($metodo == 'PUT'){
                    $this->pizzaModel->edit($xml, $_GET['hash']);
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