<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$file = new Illuminate\Http\UploadedFile(
    __DIR__.'/test_table.php',
    'test_table.php',
    'text/php',
    null,
    true
);

$request = Illuminate\Http\Request::create('/api/admin/products/8', 'POST', [
    '_method' => 'PUT',
    'category_id' => 1,
    'price' => '3000',
    'name' => 'baby fancy shirt'
], [], [
    'gallery' => [$file]
]);

$controller = new App\Http\Controllers\AdminProductController();
try {
    $response = $controller->update($request, 8);
    echo $response->getContent();
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation Error:\n";
    print_r($e->errors());
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
