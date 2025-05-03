<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

$servername = $DB_HOST;
$username = $DB_USER;
$password = $DB_PASS;
$dbname = $DB_NAME;

$conn = new mysqli($servername, $username, $password, $dbname, 3306);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT *
FROM orders
WHERE order_time >= NOW() - INTERVAL 1 HOUR
  AND NOT EXISTS (
      SELECT 1
      FROM pairs
      WHERE pairs.order_id = orders.id_order
  )
  AND order_status = 'active';
";

$result = $conn->query($sql);

$posts = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
} else {
    $posts[] = [-1];
}

header('Content-Type: application/json');
echo json_encode($posts);

$conn->close();
?>