<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer'
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);

        $kids = Category::create(['name' => 'Kids', 'slug' => 'kids']);
        $mens = Category::create(['name' => 'Mens', 'slug' => 'mens']);
        $women = Category::create(['name' => 'Women', 'slug' => 'women']);

        Product::create([
            'category_id' => $women->id,
            'name' => 'Formal Dress for Lady',
            'slug' => 'formal-dress-for-lady',
            'description' => 'A nice formal dress.',
            'price' => 70,
            'old_price' => 80,
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'W001',
            'type' => 'variable'
        ]);

        Product::create([
            'category_id' => $women->id,
            'name' => 'Nice White & Dress Combination',
            'slug' => 'nice-white-dress',
            'description' => 'A beautiful combination.',
            'price' => 45,
            'old_price' => 50,
            'image' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'W002',
            'type' => 'variable'
        ]);

        Product::create([
            'category_id' => $kids->id,
            'name' => 'Yellow & White Dress Combination for Kids',
            'slug' => 'yellow-white-kids',
            'description' => 'For kids.',
            'price' => 10,
            'old_price' => 15,
            'image' => 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'K001',
            'type' => 'variable'
        ]);

        Product::create([
            'category_id' => $mens->id,
            'name' => 'Men Red Check Shirt',
            'slug' => 'men-red-check',
            'description' => 'Red check shirt.',
            'price' => 10,
            'old_price' => 15,
            'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'M001',
            'type' => 'simple'
        ]);

        Product::create([
            'category_id' => $mens->id,
            'name' => 'Blue Check Shirt',
            'slug' => 'blue-check-shirt',
            'description' => 'Blue check shirt.',
            'price' => 10,
            'old_price' => 20,
            'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'M002',
            'type' => 'simple'
        ]);
        
        Product::create([
            'category_id' => $mens->id,
            'name' => 'Cool White Shirt',
            'slug' => 'cool-white-shirt',
            'description' => 'White shirt.',
            'price' => 5,
            'old_price' => 10,
            'image' => 'https://images.unsplash.com/photo-1596755094514-f87e32f85e98?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            'sku' => 'M003',
            'type' => 'simple'
        ]);
    }
}
