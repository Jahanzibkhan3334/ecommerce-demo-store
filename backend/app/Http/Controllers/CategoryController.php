<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Generate a unique slug, appending a number if necessary.
     */
    private function uniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (
            Category::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    /**
     * Public index: returns only categories that have at least one product,
     * with their products eager-loaded. Used by the homepage.
     */
    public function index()
    {
        $categories = Category::with(['products' => function ($query) {
            $query->with('images');
        }])
        ->has('products') // Only return categories with at least 1 product
        ->get();

        return response()->json($categories);
    }

    /**
     * Admin index: returns ALL categories (including empty ones).
     * Used by the admin panel.
     */
    public function adminIndex()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => $this->uniqueSlug($request->name),
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => $this->uniqueSlug($request->name, $category->id),
        ]);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Delete associated products first (along with their storage files) to satisfy non-null constraint
        foreach ($category->products as $product) {
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
            }
            foreach ($product->images as $img) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $img->image_path));
            }
            $product->delete();
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
