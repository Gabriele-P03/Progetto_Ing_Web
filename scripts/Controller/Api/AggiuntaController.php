<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/AggiuntaModel.php";

class AggiuntaController extends BaseController{
    private AggiuntaModel $aggiuntaModel;

    public function __construct(){
        $this->aggiuntaModel = new AggiuntaModel();
    }

    /**
     * End-point /aggiunta?pizza=idhashpizza
     * @return void
     */
    public function all(): void{
        $this->validaMetodi(array("GET"));

        try{
            $this->validaParametri(array("pizza"), null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $idHashPizza = $_GET["pizza"];
            if(!$idHashPizza){
                header(HTTP_V." 400 Bad Request");
                echo "La pizza richiesta non esiste";
                exit;
            }
            $res = $this->aggiuntaModel->getAllByPizza($idHashPizza);
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function allfilter(): void{
        $this->validaMetodi(array("GET"));
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

            //Controllo che sia stata selezionata una pizza. 
            //getAllByTipoAggiuntaExceptByPizzaAndAllergeni sfrutterà !== ""
            $idHashPizza = "";
            if(filter_has_var(INPUT_GET, "pizza")){
                $idHashPizza = $_GET["pizza"];
            }

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

    public function aggiunta(){
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
                $idHashAggiunta = $_GET["hash"];
                $this->aggiuntaModel->remove($idHashAggiunta);
            }else{
                //Prelevo il file xml
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                if($metodo == 'PUT'){
                    $idHashAggiunta = $_GET["hash"];
                    $this->aggiuntaModel->edit($idHashAggiunta, $xml);
                }else if($metodo == 'POST'){
                    $this->aggiuntaModel->save($xml);
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