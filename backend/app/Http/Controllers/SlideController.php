<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slide;
use Illuminate\Support\Facades\Storage;

class SlideController extends Controller
{
    public function index()
    {
        $slides = Slide::all();
        // Return full url for images
        $slides->transform(function ($slide) {
            $slide->image_url = asset('storage/' . $slide->image_path);
            return $slide;
        });
        return response()->json($slides);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $imagePath = $request->file('image')->store('slides', 'public');

        $slide = Slide::create([
            'title' => $request->title,
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Slide created successfully',
            'slide' => $slide,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $slide = Slide::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $slide->title = $request->title;

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if (Storage::disk('public')->exists($slide->image_path)) {
                Storage::disk('public')->delete($slide->image_path);
            }
            $slide->image_path = $request->file('image')->store('slides', 'public');
        }

        $slide->save();

        $slide->image_url = asset('storage/' . $slide->image_path);

        return response()->json([
            'message' => 'Slide updated successfully',
            'slide' => $slide,
        ]);
    }

    public function destroy($id)
    {
        $slide = Slide::find($id);

        if (!$slide) {
            return response()->json(['message' => 'Slide not found'], 404);
        }

        // Delete the file physically from storage
        if (Storage::disk('public')->exists($slide->image_path)) {
            Storage::disk('public')->delete($slide->image_path);
        }

        $slide->delete();

        return response()->json(['message' => 'Slide deleted successfully']);
    }
}
