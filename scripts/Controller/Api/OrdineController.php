<?php 

// include the base controller file
require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";
// include the base controller file
require_once PROJECT_ROOT_PATH . "/Model/OrdineModel.php";

class OrdineController extends BaseController{

    private OrdineModel $ordineModel;

    public function __construct(){
        $this->ordineModel = new OrdineModel();
    }

    public function get(){
        $this->validaMetodi(array("GET"));
        try{
            $this->validaParametri(array("prenotazione"), null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $userid = controllaCookie(COOKIE_NAME);
            header('Content-Type: application/xml; charset=utf-8');
            $hash = $_GET['prenotazione'];
            $res = $this->ordineModel->getAllByPrenotazione($hash);
            $this->inviaRispostaOK($res->asXML());  
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function save(){
        $this->validaMetodi(array("POST"));
        try{
            $this->validaParametri(array("prenotazione"), null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $userid = controllaCookie(COOKIE_NAME);

            header('Content-Type: application/xml; charset=utf-8');
            $xmlString = file_get_contents('php://input');
            $xml = new SimpleXMLElement($xmlString);

            $hash = $_GET['prenotazione'];
            $res = $this->ordineModel->save($xml, $hash,  $userid);
            $this->inviaRispostaOK($res);  
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }

    public function delete(){
        $this->validaMetodi(array("DELETE"));
        try{
            $this->validaParametri(array("ordine"), null);
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $userid = controllaCookie(COOKIE_NAME);

            header('Content-Type: application/xml; charset=utf-8');

            $hash = $_GET['ordine'];
            $this->ordineModel->remove($hash);
            $this->inviaRispostaOK("");  
        }catch(Exception $e){
            header(HTTP_V." 505 Internal Server Error");
            echo "\"".$e->getMessage()."\"";
            exit;
        }
    }
}

?>