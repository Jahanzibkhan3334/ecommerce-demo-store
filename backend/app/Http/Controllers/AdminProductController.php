<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['category', 'images'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'brand' => 'nullable|string|max:255',
            'image' => 'nullable|mimes:jpeg,jpg,png,gif,webp,avif|max:10240',
        ]);

        $data = $request->only(['name', 'category_id', 'price', 'old_price', 'description', 'sku', 'brand', 'stock', 'type']);
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product = Product::create($data);

        // Handle gallery images
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/storage/' . $path,
                ]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

    public function show($id)
    {
        return response()->json(Product::with(['category', 'images'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'brand' => 'nullable|string|max:255',
            'image' => 'nullable|mimes:jpeg,jpg,png,gif,webp,avif|max:10240',
        ]);

        $data = $request->only(['name', 'category_id', 'price', 'old_price', 'description', 'sku', 'brand', 'stock', 'type']);
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product->update($data);

        // Handle new gallery images (append, don't replace existing)
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/storage/' . $path,
                ]);
            }
        }

        return response()->json($product->load('images'));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image && str_starts_with($product->image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
        }
        // Also delete all gallery images
        foreach ($product->images as $img) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $img->image_path));
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function destroyImage($id)
    {
        $image = ProductImage::findOrFail($id);
        Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
        $image->delete();
        return response()->json(['message' => 'Image deleted successfully']);
    }
}
