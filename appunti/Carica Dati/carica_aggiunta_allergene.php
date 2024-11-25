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
    "Salsa di Pomodoro" => array(),
    "Mozzarella" => array("Latte e derivati"),
    "Prosciutto Cotto" => array(),
    "Olive" => array(),
    "Patatine Fritte" => array("Glutine"),
    "Tonno" => array("Pesce e derivati"),
    "Prosciutto Crudo" => array(),
    "Salame Dolce" => array(),
    "Salame Piccante" => array(),
    "Mortadella" => array(),
    "Olio di Oliva" => array(),
    "Wurstel" => array(),
    "Panna" => array("Latte e derivati"),

    "Cipolla Bianca" => array(),
    "Cipolla Rossa" => array(),
    "Rucola" => array(),
    "Grana Padano DOC" => array("Latte e derivati"),
    "Bocconcini di Mozzarella" => array("Latte e derivati"),
    "Pomodorini" => array(),
    "Datterini Gialli" => array(),
    "Carciofi" => array(),
    "Funghi" => array(),
    "Frutti di Mare" => array("Molluschi e derivati", "Crostacei e derivati","Pesce e derivati"),
    "Bresaola" => array(),
    "Gorgonzola" => array( "Latte e derivati"),
    "Scamorza Affumicata" => array( "Latte e derivati"),
    "Svizzero" => array( "Latte e derivati"),
    "Kebab" => array(),
    "!!!!ANANAS" => array(),
    "Burratina" => array("Latte e derivati"),
    "Granella di Pistacchio" => array("Frutta a guscio e derivati"),
    "Crema di Pistacchio" => array("Frutta a guscio e derivati"),
    "Acciughe" => array("Pesce e derivati"),
    "Aglio" => array(),
    "Mozzarella Senza Lattosio" => array(),
    "Uova" => array("Uova e derivati")
);

$ALLERGENE_TAB_NAME = "AGGIUNTA";
$COLONNA = array("NOME", "PREZZO", "QUANTITA", "ID_TIPO_AGGIUNTA");

foreach($array as $key => $value) {
    
    $sql = "INSERT INTO " .$ALLERGENE_TAB_NAME. " VALUE(NULL, NULL,";
    for($i = 0; $i < count($COLONNA); $i++){
        $sql = $sql . "\"". $value[$i] ."\"";
        if($i < count($COLONNA)-1){
            $sql = $sql . ", ";
        }
    }
    $sql = $sql . ")";
    echo $sql. "\n";
    $result = mysqli_query($conn, $sql);
    if($result){
        //Adesso salvo l'idHash
        $sql = "SELECT ID FROM ".$ALLERGENE_TAB_NAME. " WHERE ". $COLONNA[0]. " = \"" . $value[0] . "\"";

        $result = $conn->query($sql);
        if($result){
            $id = $result->fetch_assoc()["ID"];
            $id_hash = hash('sha256', strval($id), false);
            $sql = "UPDATE ".$ALLERGENE_TAB_NAME." SET ID_HASH = '".$id_hash."' WHERE ID = '".$id."'";
            print("Salvando il digest in sha256 di $value[0]: $id -> $sql\n\n\n");
            $result = $conn->query($sql);
            if(!$result){
                die("". $conn->error);
            }
        }else{
            die("". $conn->error);
        }
    }else{
        die("". $conn->error);
    }
}