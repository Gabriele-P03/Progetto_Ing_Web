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
    2, 6, 6, 10, 4, 2, 3, 5, 20, 20, 18
);

$ALLERGENE_TAB_NAME = "TAVOLO";
$COLONNA = "POSTI";

foreach($array as $key => $value) {
    
    $sql = "INSERT INTO " .$ALLERGENE_TAB_NAME. " VALUE(NULL, NULL, '$value')";
    $result = mysqli_query($conn, $sql);
    if($result){
            $id = $conn->insert_id;
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
}