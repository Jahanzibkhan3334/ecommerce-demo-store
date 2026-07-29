<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('brand') && $request->brand != '') {
            $query->where('brand', $request->brand);
        }

        if ($request->has('is_featured')) {
            // Assuming we could filter by featured, but we don't have is_featured column. 
            // We can just return some random or latest for now for simplicity.
        }

        $products = $query->latest()->get();
        return response()->json($products);
    }

    public function brands()
    {
        $brands = Product::whereNotNull('brand')->where('brand', '!=', '')->distinct()->pluck('brand');
        return response()->json($brands);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images'])->findOrFail($id);
        return response()->json($product);
    }
}
