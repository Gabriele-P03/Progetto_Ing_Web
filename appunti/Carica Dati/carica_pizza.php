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
    array("Base Ciccio", 3.5),
    array("Margherita", 4.0),
    array("Capricciosa", 5.0),
    array("Tonno e Cipolla", 4.5),	
    array("4 Formaggi", 5.0),	
    array("4 Stagioni", 5.0),	
    array("Americana", 5.0),	
    array("Crudaiola", 7.0),	
    array("Valtellina", 6.0),	
    array("Contadina", 6.0),	
    array("Funghi e Salsiccia", 5.0),	
    array("Bufala Speciale", 7.0),	
    array("Calabrese", 6.0),	
    array("Diavola", 4.5)
);

$PIZZA_TAB_NAME = "PIZZA";
$COLONNA = array("NOME", "PREZZO");

foreach($array as $key => $value) {
    
    $sql = "INSERT INTO " .$PIZZA_TAB_NAME. " VALUE(NULL, NULL, '$value[0]', '$value[1]')";
    print("Inserendo $key:  $sql\n");
    $result = mysqli_query($conn, $sql);
    if($result){
        //Adesso salvo l'idHash
        $sql = "SELECT ID FROM ".$PIZZA_TAB_NAME. " WHERE ".$COLONNA[0]." = '".$value[0]."'";
        $result = $conn->query($sql);
        if($result){
            $id = $result->fetch_assoc()["ID"];
            $id_hash = hash('sha256', strval($id), false);
            $sql = "UPDATE ".$PIZZA_TAB_NAME." SET ID_HASH = '".$id_hash."' WHERE ID = '".$id."'";
            print("Salvando il digest in sha256 di $key: $id -> $sql\n\n\n");
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