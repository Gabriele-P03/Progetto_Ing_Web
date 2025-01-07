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

    public function ordine(){
        $this->validaMetodi(array("DELETE", "POST", "PUT", "GET"));
        $metodo = $_SERVER['REQUEST_METHOD'];
        try{
            if($metodo == 'DELETE'){
                $this->validaParametri(array("ordine"), null);
            }else if($metodo == 'GET'){
                $this->validaParametri(array("prenotazione"), null);
            }else if($metodo == 'POST'){
                $this->validaParametri(array("prenotazione"), null);
            }else if($metodo == 'PUT'){
                $this->validaParametri(array("ordine"), null);
            }
        }catch(Exception $e){
            header(HTTP_V." 400 Bad Request");
            echo "\"".$e->getMessage()."\"";
            exit;
        }

        try{
            $userid = controllaCookie(COOKIE_NAME);
            if($metodo == 'DELETE'){
                $hash = $_GET['ordine'];
                $this->ordineModel->remove($hash);
            }else if($metodo == 'GET'){
                header('Content-Type: application/xml; charset=utf-8');
                $hash = $_GET['prenotazione'];
                $res = $this->ordineModel->getAllByPrenotazione($hash);
                $this->inviaRispostaOK($res->asXML());  
                exit;
            }else{
                header('Content-Type: application/xml; charset=utf-8');
                $xmlString = file_get_contents('php://input');
                $xml = new SimpleXMLElement($xmlString);
                if($metodo == 'POST'){
                    $this->ordineModel->save($xml, $_GET['prenotazione'],  $userid);
                }else if($metodo == 'PUT'){
                    $this->ordineModel->update($xml, $_GET['ordine'], $userid);
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