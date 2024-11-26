<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/PizzaModel.php";

class PizzaController extends BaseController{
    private PizzaModel $pizzaModel;

    public function __construct(){
        $this->pizzaModel = new PizzaModel();
    }

        /**
     * End-point /pizza/all
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
            $res = $this->pizzaModel->getAll();
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