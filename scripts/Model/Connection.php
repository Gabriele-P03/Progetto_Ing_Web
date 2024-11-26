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
        try {
            $stmt = $this->executeStatement($query, $params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $result;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    private function executeStatement($query = "", $params = []){
        try {
            $stmt = $this->connection->prepare($query);
            if ($stmt === false) {
                throw new Exception("Non è stato possibile eseguire la query: " . $query);
            }
            if ($params) {
                if(!$stmt->bind_param($params[0], $params[1])){
                    throw new Exception("Non è stato possibile eseguire il binding dei parametri: ". implode(", ", $params) ."". $query);
                }
            }
            $stmt->execute();
            return $stmt;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}

?>