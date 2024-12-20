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
    //Inserire qui altri allergeni a piacere
    "Salsa di Pomodoro" => array("Glutine", "Soia e derivati"),
    "Mozzarella" => array("Latte e derivati"),
    "Patatine Fritte" => array("Glutine"),
    "Tonno" => array("Pesce e derivati"),
    "Panna" =>array("Latte e derivati"),
    "Grana Padano DOC" => array("Latte e derivati"),
    "Bocconcini di Mozzarella" =>array("Latte e derivati"),
    "Frutti di Mare" => array("Pesce e derivati", "Crostacei e derivati", "Molluschi e derivati"),
    "Gorgonzola"=>array("Latte e derivati"),
    "Scamorza Affumicata"=>array("Latte e derivati"),
    "Svizzero"=>array("Latte e derivati"),
    "Burratina"=>array("Latte e derivati"),
    "Granella di Pistacchio"=>array("Latte e derivati", "Frutta a guscio e derivati"),
    "Crema di Pistacchio"=>array("Latte e derivati", "Soia e derivati", "Frutta a guscio e derivati"),
    "Acciughe" =>array("Pesce e derivati"),
    "Uova" =>array("Uova e derivati"),
    "Bufala"=>array("Latte e derivati"),
    "Coca-Cola"=>array("Glutine"),
    "Coca-Cola Zero"=>array("Glutine"),
    "Thè Pesca"=>array("Glutine"),
    "Thè Limone"=>array("Glutine"),
    "Raffo 0.33l"=>array("Glutine"),
    "Raffo 0.66l"=>array("Glutine"),
    "Dreher 0.33l"=>array("Glutine"),
    "Dreher 0.66l"=>array("Glutine"),
    "Nastro Azzurro"=>array("Glutine"),
    "Beck's"=>array("Glutine"),
    "Corona"=>array("Glutine"),
    "Super Tennet's"=>array("Glutine"),
    "Ketchup"=>array("Glutine"),
    "Maionese"=>array("Glutine"),
    "BBQ"=>array("Glutine"),
    "Senape"=>array("Glutine"),
    "Salsa Piccante"=>array("Glutine"),
    "Salsa Yogurt"=>array("Glutine")

);

$AGGIUNTA_ALLERGENE_TAB_NAME = "AGGIUNTA_ALLERGENE";
$ALLERGENE_TAB_NAME = "ALLERGENE";
$AGGIUNTA_TAB_NAME = "AGGIUNTA";

foreach($array as $key => $value) {
    $sql = "SELECT ID FROM " . $AGGIUNTA_TAB_NAME . " WHERE NOME = \"" . $key . "\"";
    $result = $conn->query($sql);
    if($result->num_rows > 0) {
        $idAggiunta = $result->fetch_assoc()["ID"]; 
        foreach($value as $allergene){
            $sql = "SELECT ID FROM " . $ALLERGENE_TAB_NAME . " WHERE ETICHETTA = \"" . $allergene ."\"";
            $result = $conn->query($sql);
            if($result->num_rows > 0) {
                $idAllergene = $result->fetch_assoc()["ID"];
                $sql = "INSERT INTO " . $AGGIUNTA_ALLERGENE_TAB_NAME . " VALUES(NULL, '".$idAggiunta."','".$idAllergene."')";
                $result = $conn->query($sql);
                if(!$result){
                    die("Non sono riuscito a inserire la n-n tra " . $aggiunta . " e " . $allergene);
                }
            }else{
                die("Non sono riuscito a trovare l'id dell'allergene " . $allergene);
            }
        }
    } else {
        die("Non sono riusciuto a trovare l'id dell'aggiunta " . $key);
    }
}