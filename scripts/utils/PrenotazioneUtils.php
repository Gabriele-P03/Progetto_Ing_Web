<?php 

/**
 * Funzioni per la generazione, a partire dai SQL result, del file XML da mandare al FE
 * per riemprire la tabella dei vari ordini di una prenotazione
 * 
 * Esso sarà di una struttura tipo:
 * <results>
 * 
 *  <row>
 *      <pizza idHash= nome=>
 *          <aggiunta idHash= nome= />
 *      </pizza>
 *      <friggitoria>
 *          <aggiunta idHash= nome= />
 *          .
 *          .
 *          .
 *          <aggiunta idHash= nome= /> 
 *      </friggitoria>
 *      <bevande>
 *          <aggiunta idHash= nome= />
 *          .
 *          .
 *          .
 *          <aggiunta idHash= nome= />       
 *      </bevande>
 *  </row
 * 
 * </results>
 * 
 * L'elemento pizza può essere null. 
 * Tutti gli elementi aggiunta all'interno dell'elemento pizza sono da intendere come aggiunte sulla pizza
 */

require_once PROJECT_ROOT_PATH ."inc/config.php";

function nnn_prenotazioneToXML($result){
    $xml = new SimpleXMLElement("<results />");
    foreach($result as $row){
        $idAggiunta = $row[DB_PRENOTAZIONEPIZZAAGGIUNTA_IDAGGIUNTA];
        $idPizza = $row[DB_PRENOTAZIONEPIZZAAGGIUNTA_IDPIZZA];

        if($idAggiunta == null && $idPizza == null){
            throw new Exception("Vi è una tupla senza niente");
        }

        $row = null;
        if($idPizza != null){
            $row = $xml->xpath()
        }

    }
    return $xml->asXML();
}

?>