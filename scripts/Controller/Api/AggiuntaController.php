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
        $this->validaMetodi("GET");

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
}

?>