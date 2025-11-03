<?php

echo "Testing database connection...\n";

$maxAttempts = 30;
$attempt = 0;

while ($attempt < $maxAttempts) {
    $attempt++;
    
    try {
        $pdo = new PDO(
            'pgsql:host=postgres;port=5432;dbname=todo_db',
            'todo_user',
            'todo_password',
            [PDO::ATTR_TIMEOUT => 5]
        );
        
        $pdo->query('SELECT 1');
        echo "Database connection successful!\n";
        exit(0);
        
    } catch (Exception $e) {
        echo "Attempt $attempt/$maxAttempts: " . $e->getMessage() . "\n";
        sleep(2);
    }
}

echo "Failed to connect to database after $maxAttempts attempts\n";
exit(1);