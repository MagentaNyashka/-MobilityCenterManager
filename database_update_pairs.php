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
$employeeId = $input['employeeId'] ?? null;
$orderTime = $input['orderTime'] ?? null;
$endTime = $input['endTime'] ?? null;

$end = date("Y-m-d H:i:s", strtotime($orderTime . " + $endTime minutes"));
echo($end);

if (!$orderId || !$employeeId || !$orderTime) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$conn->begin_transaction();

try {
    // 1. pairs
    $stmt1 = $conn->prepare("INSERT INTO pairs (order_id, employee_id, order_time, end_time) VALUES (?, ?, ?, ?)");
    $stmt1->bind_param("iiss", $orderId, $employeeId, $orderTime, $end);
    $stmt1->execute();
    $stmt1->close();

    // 2. orders
    $stmt2 = $conn->prepare("UPDATE orders SET order_status = 'in_progress' WHERE id_order = ?");
    $stmt2->bind_param("i", $orderId);
    $stmt2->execute();
    $stmt2->close();

    // 3. employees
    $stmt3 = $conn->prepare("UPDATE employees SET status = 'busy', end_time = ?, current_station = (
        SELECT destination
        FROM orders
        WHERE id_order = ?
    ) WHERE id_employee = ?
     ");
    $stmt3->bind_param("sii", $end, $orderId, $employeeId);
    $stmt3->execute();
    $stmt3->close();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'All updates successful']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['error' => 'Transaction failed: ' . $e->getMessage()]);
}

$conn->close();
?>
