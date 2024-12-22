<?php

// include the base controller file
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
// include the base controller file
require_once PROJECT_ROOT_PATH . "/Model/AllergeneModel.php";

class AllergeniController extends BaseController{

    private AllergeneModel $userModel;

    public function __construct(){
        $this->userModel = new AllergeneModel();
    }

    /**
     * End-point /allergene
     * @return void
     */
    public function all(): void{
        $this->validaMetodi(array("GET"));

        try{
            $this->validaParametri(null, null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
        try{
            $res = $this->userModel->getAll();
            $res_xml = $this->res_to_xml($res);
            $this->inviaRispostaOK($res_xml);   
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}