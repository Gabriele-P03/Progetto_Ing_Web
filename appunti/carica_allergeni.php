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
    "Glutine",
    "Crostacei e derivati",
    "Uova e derivati",
    "Pesce e derivati",	
    "Arachidi e derivati", 
    "Soia e derivati",	
    "Latte e derivati",
    "Frutta a guscio e derivati",
    "Sedano e derivati",
    "Senape e derivati", 
    "Semi di sesamo e derivati",
    "Anidride solforosa e solfiti in concentrazioni superiori a 10 mg/kg o 10 mg/l espressi come SO2",
    "Lupino e derivati",
    "Molluschi e derivati"

);

$ALLERGENE_TAB_NAME = "ALLERGENE";
$COLONNA = "ETICHETTA";

foreach($array as $key => $value) {
    
    $sql = "INSERT INTO " .$ALLERGENE_TAB_NAME. " VALUE(NULL, NULL, '$value')";
    print("Inserendo $value:  $sql\n");
    $result = mysqli_query($conn, $sql);
    if($result){
        //Adesso salvo l'idHash
        $sql = "SELECT ID FROM ".$ALLERGENE_TAB_NAME. " WHERE ".$COLONNA." = '".$value."'";
        $result = $conn->query($sql);
        if($result){
            $id = $result->fetch_assoc()["ID"];
            $id_hash = hash('sha256', strval($id), false);
            $sql = "UPDATE ".$ALLERGENE_TAB_NAME." SET ID_HASH = '".$id_hash."' WHERE ID = '".$id."'";
            print("Salvando il digest in sha256 di $value: $id -> $sql\n\n\n");
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