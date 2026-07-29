<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/admin/products/8', 'POST', [
    '_method' => 'PUT',
    'name' => 'baby fancy shirt',
    'category_id' => 1,
    'price' => '3000.00',
    'old_price' => '3500.00',
    'type' => 'simple',
    'stock' => 0
]);

$controller = new App\Http\Controllers\AdminProductController();
try {
    $response = $controller->update($request, 8);
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo $response->getContent();
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
