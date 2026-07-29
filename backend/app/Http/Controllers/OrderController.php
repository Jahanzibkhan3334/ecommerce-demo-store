<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)->latest()->get();
        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with('items.product')->where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip' => 'required|string',
            'phone' => 'required|string',
            'payment_method' => 'required|string',
            'shipping_cost' => 'required|numeric'
        ]);

        $carts = Cart::with('product')->where('user_id', $request->user()->id)->get();
        
        if ($carts->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $total = $carts->sum(function($cart) {
            return $cart->quantity * $cart->product->price;
        });

        $grand_total = $total + $request->shipping_cost;

        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'payment_status' => $request->payment_method === 'Stripe' ? 'paid' : 'pending',
            'total' => $total,
            'shipping_cost' => $request->shipping_cost,
            'grand_total' => $grand_total,
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'zip' => $request->zip,
            'phone' => $request->phone,
        ]);

        foreach ($carts as $cart) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cart->product_id,
                'quantity' => $cart->quantity,
                'price' => $cart->product->price,
                'size' => $cart->size,
            ]);
        }

        // Clear cart
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json($order->load('items.product'));
    }

    public function adminIndex(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $orders = Order::with('user')->latest()->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json($order);
    }

    public function adminShow(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        return response()->json($order);
    }
}
