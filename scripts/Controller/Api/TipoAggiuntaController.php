<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
require_once PROJECT_ROOT_PATH . "/Model/TipoAggiuntaModel.php";

class TipoAggiuntaController extends BaseController{
    private TipoAggiuntaModel $tipoAggiuntaModel;

    public function __construct(){
        $this->tipoAggiuntaModel = new TipoAggiuntaModel();
    }

    /**
     * End-point /tipoaggiunta/all
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
            $res = $this->tipoAggiuntaModel->getAll();
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