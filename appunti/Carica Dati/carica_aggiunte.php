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
    array("Salsa di Pomodoro", 0.0, 1, 2),
    array("Mozzarella", 0.0, 1, 2),
    array("Prosciutto Cotto", 0.5, 1, 2),
    array("Olive", 0.1, 1, 2),
    array("Patatine Fritte", 1.5, 1, 1),
    array("Tonno", 0.5, 1, 2),
    array("Prosciutto Crudo", 0.5, 1, 2),
    array("Salame Dolce", 0.5, 1, 2),
    array("Salame Piccante", 0.5, 1, 2),
    array("Mortadella", 0.5, 1, 2),
    array("Olio di Oliva", 0.0, 1, 2),
    array("Wurstel", 0.5, 1, 2),	
    array("Panna", 0.5, 1, 2),
    array("Cipolla Bianca", 0.5, 1, 2),
    array("Cipolla Rossa", 0.5, 1, 2),
    array("Rucola", 0.1, 1, 2),
    array("Grana Padano DOC", 0.5, 1, 2),
    array("Bocconcini di Mozzarella", 0.5, 1, 2),
    array("Pomodorini", 0.1, 1, 2),
    array("Datterini Gialli", 0.5, 1, 2),
    array("Carciofi", 0.1, 1, 2),
    array("Funghi", 0.1, 1, 2),
    array("Frutti di Mare", 0.5, 1, 2),
    array("Bresaola", 0.5, 1, 2),
    array("Gorgonzola", 0.5, 1, 2),
    array("Scamorza Affumicata", 0.5, 1, 2),
    array("Svizzero", 0.5, 1, 2),
    array("Kebab", 0.5, 1, 2),
    array("Burratina", 0.5, 1, 2),
    array("Granella di Pistacchio", 0.5, 1, 2),
    array("Crema di Pistacchio", 0.5, 1, 2),
    array("Acciughe", 0.1, 1, 2),
    array("Aglio", 0.0, 1, 2),
    array("Mozzarella Senza Lattosio", 0.0, 1, 2),
    array("Uova", 0.25, 1, 2),
    array("Olio", 0.0, 1, 2),
    array("Bufala", 0.5, 1, 2),
    array("Zucchine", 0.5, 1, 2),
    array("Melanzane", 0.5, 1, 2),
    array("Peperoni", 0.5, 1, 2),

    //bevande
    array("Acqua Naturale 0.5cc", 0.5, 1, 3),
    array("Acqua Naturale 1l", 1.0, 1, 3),
    array("Acqua Frizzante 0.5cc", 0.5, 1, 3),
    array("Coca-Cola", 1.5, 1, 3),
    array("Coca-Cola Zero", 1.5, 1, 3),
    array("Thè Pesca", 1.5, 1, 3),
    array("Thè Limone", 1.5, 1, 3),
    array("Raffo 0.33l", 1.5, 1, 3),
    array("Raffo 0.66l", 2, 1, 3),
    array("Dreher 0.33l", 1.5, 1, 3),
    array("Dreher 0.66l", 2.0, 1, 3),
    array("Nastro Azzurro", 2.0, 1, 3),
    array("Beck's", 2.0, 1, 3),
    array("Corona", 2.0, 1, 3),
    array("Super Tennet's", 2.5, 1, 3),
    
    //Salse
    array("Ketchup", 0.0, 1, 4),
    array("Maionese", 0.0, 1, 4),
    array("BBQ", 0.0, 1, 4),
    array("Senape", 0.0, 1, 4),
    array("Salsa Piccante", 0.0, 1, 4),
    array("Salsa Yogurt", 0.0, 1, 4)

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