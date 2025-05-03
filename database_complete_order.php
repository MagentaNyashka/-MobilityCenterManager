<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once 'config.php';

$servername = $DB_HOST;
$username = $DB_USER;
$password = $DB_PASS;
$dbname = $DB_NAME;

$conn = new mysqli($servername, $username, $password, $dbname, 3306);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['orderId'] ?? null;

if (!$orderId) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("SELECT employee_id FROM pairs WHERE order_id = ?");
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $employeeId = $row['employee_id'] ?? null;

    if (!$employeeId) {
        throw new Exception("No matching pair found for order_id: $orderId");
    }

    $stmt = $conn->prepare("UPDATE employees SET status = 'free' WHERE id_employee = ?");
    $stmt->bind_param("i", $employeeId);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update employee status");
    }

    $stmt = $conn->prepare("UPDATE orders SET order_status = 'completed' WHERE id_order = ?");
    $stmt->bind_param("i", $orderId);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update order status");
    }

    $stmt = $conn->prepare("DELETE FROM pairs WHERE order_id = ?");
    $stmt->bind_param("i", $orderId);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete pair");
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Order completed successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>