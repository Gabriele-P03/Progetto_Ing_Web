<?php



class Connection{


    private $connection = null;

    public function __construct(){
        $this->connection = mysqli_connect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);
        if (mysqli_connect_errno()) {
            throw new Exception("Non è stato possibile connettersi al DB");
        }
    }

    protected function isConnected(){
        
    }

    public function select( $query = "", $params = []){
        try{
            return $this->selectWithTypes( $query, str_repeat('s', count($params)), $params );
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    public function insert( $query = "", $types = "", $params = [], $tableName = ""): string{
        try {
            //echo $query . "\n" . $types ."\n" . implode(", ", $params);
            //exit;
            $stmt = $this->executeStatement($query, $types, $params);
            $shaSQL = "UPDATE " . $tableName . " SET ID_HASH = SHA2(?, 256) WHERE ID = ?";
            $inserted_id = $this->connection->insert_id;
            $stmt = $this->executeStatement($shaSQL, "dd", array($inserted_id, $inserted_id));
            $stmt->close();
            $shaID = hash('sha256', $inserted_id);
            return $shaID;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function delete( $query = "", $types = "", $params = []): void{
        try {
            $stmt = $this->executeStatement($query, $types, $params);
            $stmt->close();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function selectWithTypes( $query = "", $types = "", $params = []){
        try {
            $stmt = $this->executeStatement($query, $types, $params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $result;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    private function executeStatement($query = "", $types = "", $params = []){
        try {
            $stmt = $this->connection->prepare($query);
            if ($stmt === false) {
                throw new Exception("Non è stato possibile eseguire la query: " . $query);
            }
            if ($params) {
                if(!$stmt->bind_param($types, ...$params)){
                    throw new Exception("Non è stato possibile eseguire il binding dei parametri: ". implode(", ", $params) ."". $query);
                }
            }


            if(!$stmt->execute()){
                throw new Exception("Errore nell'esecuzione della SQL: ". $stmt->error);
            }
            return $stmt;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}

?>