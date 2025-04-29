<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "Bghujknmol123";
$dbname = "mobile_center_db";

$conn = new mysqli($servername, $username, $password, $dbname, 3306);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$orderId = $input['orderId'] ?? null;
$newStatus = $input['newStatus'] ?? null;

if (!$orderId || !$newStatus) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$sql = "UPDATE orders SET order_status = ? WHERE id_order = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $newStatus, $orderId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Order status updated"]);
} else {
    echo json_encode(["error" => "Failed to update order status: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
