<?php

class BaseController{

    /**
     * Metodo chiamato ogni volta che una funzione non viene trovata, dunque utile per le API
     * @param mixed $name
     * @param mixed $args
     * @return void
     */
    public function __call($name, $args){
        
    }

    protected function inviaRispostaOK(string $data){
        $this->inviaRisposta( $data, array(HTTP_V." 200 OK") );
    }

    protected function inviaRisposta($data, $httpHeaders = array()){
        //In php 0 == false e qualsiasi valore > 0 vale true a causa di == (e non ===)
        if(is_array($httpHeaders) && count($httpHeaders)){
            foreach($httpHeaders as $httpHeader){
                header($httpHeader);
            }
        }
        echo $data;
        exit;
    }

    /**
     * Crea un array con tutti gli elementi dell'URI (explode '/')
     * @return bool|string[]
     */
    protected function getURIElements(){
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode('/', $uri);
        return $uri;
    }

    /**
     * Crea un array contenente tutti i parametri
     * @return array
     */
    protected function getQueryStringParams(){
        parse_str($_SERVER['QUERY_STRING'], $result);
        return $result;
    }

    protected function validaMetodi($metodi = array()){
        $erroreHeader = HTTP_V." 405 Method Not Allowed";
        $metodo = $_SERVER["REQUEST_METHOD"];
        if(is_array($metodi)){
            if(in_array($metodo, $metodi)){
                return true;
            }else{
                header($erroreHeader);
            }
        }else{
            $erroreHeader = HTTP_V." 400 Bad Request";
        }
    }

    protected function validaParametri($paramsExpected, $paramsOptional):void{
        $params = $this->getQueryStringParams();
        if( count($params) == 0 ){  
            if($paramsExpected){    //ParamsExpected se null o vuoto è comunque false
                throw new RuntimeException("La chiamta non ha ricevuto parametri seppur aspettati");
            }
        }else{
            if(!$paramsExpected && !$paramsOptional){
                throw new RuntimeException("La chiamta ha ricevuto ".count($params) ." parametri: " . implode(", ", $params) . " ma non so con quali controllarli");
            }
            if($paramsExpected){
                foreach($paramsExpected as $param){
                    if(!array_key_exists($param, $params)){
                        throw new RuntimeException("Il parametro ". $param ." non è stato ricevuto. Ricevuti: " . implode(", ", $params));
                    }
                }
            }
            if($paramsOptional){
                foreach($params as $param){
                    if(!array_key_exists($param, $paramsOptional) && ($paramsExpected && !array_key_exists($param, $paramsExpected))) {
                        throw new RuntimeException("Il parametro ". $param ." è stato ricevuto ma non era atteso");
                    }
                }
            }
        }
    }

    /**
     * Valida i parametri ricevuti, in quantitativo arbitrario, secondo un singolo regex
     * @param string the regex pattern
     * @return void
     */
    protected function validaParametriArbitrari($regex = string){
        $params = $this->getQueryStringParams();
        if($params){
            foreach($params as $key => $value){
                if( !preg_match($regex, $key) ){
                    throw new RuntimeException("Parametro arbitrario non valido: ". $key);
                }
            }
        }
    }

    protected function res_to_xml( $data = array() | null ) : string|null{
        $xml = new SimpleXMLElement("<results />");
        if(is_array($data)){
            for($i = 0; $i < count($data); $i++){
                $row = $data[$i];
                $child = $xml->addChild("row");
                foreach($row as $key => $value){
                    $child->addChild($key, $value);
                }
                
            }
            return $xml->asXML();
        }
        return null;
    }
}