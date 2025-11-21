<?php
// Include the database connection file
require_once 'db_connect.php';

// Make sure the settings table exists
ensureSettingsTableExists($conn);

$tableName = "investofuture_settings";
$settingsKey = "all_settings";

// Handle the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // --- HANDLE SAVING DATA ---
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON received.']);
        exit;
    }

    $settings_value = json_encode($data);

    // Check if the settings record already exists
    $check_sql = "SELECT id FROM $tableName WHERE settings_key = ?";
    $stmt_check = $conn->prepare($check_sql);
    $stmt_check->bind_param("s", $settingsKey);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    if ($result->num_rows > 0) {
        // Update existing record
        $update_sql = "UPDATE $tableName SET settings_value = ? WHERE settings_key = ?";
        $stmt_update = $conn->prepare($update_sql);
        $stmt_update->bind_param("ss", $settings_value, $settingsKey);
        if ($stmt_update->execute()) {
            echo json_encode(['success' => true, 'message' => 'Settings updated successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update settings.']);
        }
        $stmt_update->close();
    } else {
        // Insert new record
        $insert_sql = "INSERT INTO $tableName (settings_key, settings_value) VALUES (?, ?)";
        $stmt_insert = $conn->prepare($insert_sql);
        $stmt_insert->bind_param("ss", $settingsKey, $settings_value);
        if ($stmt_insert->execute()) {
            echo json_encode(['success' => true, 'message' => 'Settings saved successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save settings.']);
        }
        $stmt_insert->close();
    }
    $stmt_check->close();

} elseif ($method === 'GET') {
    // --- HANDLE LOADING DATA ---
    $sql = "SELECT settings_value FROM $tableName WHERE settings_key = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $settingsKey);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        header('Content-Type: application/json');
        // Directly output the JSON string from the database
        echo $row['settings_value'];
    } else {
        // If no settings found, return an empty object
        echo json_encode([]);
    }
    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>