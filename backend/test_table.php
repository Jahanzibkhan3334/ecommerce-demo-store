<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $count = Illuminate\Support\Facades\DB::table('product_images')->count();
    echo 'Product images table exists, count: ' . $count;
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
