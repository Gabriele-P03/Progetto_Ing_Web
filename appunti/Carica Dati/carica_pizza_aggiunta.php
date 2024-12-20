<?php

/**
 * Questo è un piccolo script per inserire nella tabella ALLERGENE delle tuple iniziali
*/


$servername = "127.0.0.1";
$username = "PIZZERIA";
$password = 'tC)L27T@sUuYnw92';
$dbname = "PIZZERIA";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("". $conn->connect_error);
}

$array = array(
    "Base Ciccio" => array("Olio", "Salsa di Pomodoro"),
    "Margherita" => array("Salsa di Pomodoro", "Mozzarella"),
    "Capricciosa" => array("Salsa di Pomodoro", "Mozzarella", "Prosciutto Cotto", "Salame Piccante", "Carciofi", "Funghi", "Olive"),
    "Tonno e Cipolla"	 => array("Salsa di Pomodoro", "Mozzarella", "Tonno", "Cipolla Bianca"),
    "4 Formaggi" => array("Salsa di Pomodoro", "Mozzarella", "Svizzero", "Scamorza Affumicata", "Gorgonzola"),
    "Americana" => array("Salsa di Pomodoro", "Mozzarella", "Wurstel", "Patatine Fritte"),
    "Crudaiola" => array("Salsa di Pomodoro", "Olio", "Prosciutto Crudo", "Bocconcini di Mozzarella", "Rucola", "Grana Padano DOC", "Pomodorini"),
    "Funghi e Salsiccia" => array("Salsa di Pomodoro", "Mozzarella", "Funghi", "Salame Piccante"),
    "Bufala Speciale" => array("Salsa di Pomodoro", "Mozzarella", "Bufala", "Mortadella", "Granella di Pistacchio"),
    "Calabrese" => array("Salsa di Pomodoro", "Mozzarella", "Salame Piccante"),
    "Diavola" => array("Salsa di Pomodoro", "Mozzarella", "Salame Piccante"),
    "4 Stagioni" => array("Salsa di Pomodoro", "Mozzarella", "Prosciutto Cotto", "Olive", "Carciofi", "Funghi"),
    "Valtellina" => array("Salsa di Pomodoro", "Mozzarella", "Bresaola", "Grana Padano DOC", "Rucola"),
    "Contadina" => array("Salsa di Pomodoro", "Mozzarella", "Melanzane", "Zucchine", "Peperoni")
);

$PIZZA_TAB_NAME = "PIZZA";
$PIZZA_AGGIUNTA_TAB_NAME = "PIZZA_AGGIUNTA";
$AGGIUNTA_TAB_NAME = "AGGIUNTA";
$COLONNA = array("NOME", "PREZZO", "QUANTITA", "ID_TIPO_AGGIUNTA");

foreach($array as $key => $value) {

    if($value){

        $sql = "SELECT ID FROM ".$PIZZA_TAB_NAME . " WHERE NOME = \"" . $key . "\"";
        $idPizza;
        $result = mysqli_query($conn, $sql);
        if($result){
            $idPizza = mysqli_fetch_row($result)[0];
        }else{
            die("Nessuna tupla trovata per l'aggiunta: ". $key);
        }

        $sql = "SELECT ID FROM ".$AGGIUNTA_TAB_NAME . " WHERE NOME IN (\"" . implode("\",\"", $value) . "\")";
        $result = mysqli_query($conn, $sql);
        if(mysqli_num_rows($result) === count($value)) {
            
            foreach($result as $row ){
                $idAggiunta = $row["ID"];

                $sql = "INSERT INTO ". $PIZZA_AGGIUNTA_TAB_NAME. " VALUES (NULL, $idAggiunta, $idPizza)";
                $result = mysqli_query($conn, $sql);
                if(!$result){
                    die("Non è stata salvata la N-N tra ". $idPizza . " e " . $idAggiunta);
                }
            }

        }else{
            die("Non sono state trovate le righe di tutti gli ingredeinti (" . $key ."): ". implode(", ", $value) . "\n\n" . $sql);
        }
    
    }
}