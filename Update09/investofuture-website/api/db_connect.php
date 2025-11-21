<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

// --- STEP 1: Enter your database details here ---
$servername = "localhost"; // Usually "localhost" on Hostinger
$username = "u263800772_investofuture"; // Your database username
$password = "Akky2013@"; // Your database password
$dbname = "u263800772_investofuture";     // Your database name

// --- STEP 2: The code below connects to the database ---

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  // If connection fails, stop and show an error.
  die(json_encode([
      "success" => false,
      "message" => "Database connection failed: " . $conn->connect_error
  ]));
}

// Function to create the settings table if it doesn't exist
function ensureSettingsTableExists($conn) {
    $tableName = "investofuture_settings";
    $sql = "CREATE TABLE IF NOT EXISTS $tableName (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        settings_key VARCHAR(255) NOT NULL UNIQUE,
        settings_value LONGTEXT NOT NULL,
        reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql) !== TRUE) {
        // If table creation fails, stop and show an error.
        die(json_encode([
            "success" => false,
            "message" => "Error creating table: " . $conn->error
        ]));
    }
}
?>