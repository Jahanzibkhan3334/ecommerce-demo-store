import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import Breadcrumb from '../components/Breadcrumb';
import { getImageUrl } from '../utils/helpers';

const SHIPPING = 3;

function Cart() {
    const { cart, removeFromCart, updateCartQuantity } = useContext(AppContext);

    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const grandTotal = subtotal + SHIPPING;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb crumbs={[{ label: 'Home', path: '/' }, { label: 'Cart' }]} />
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    Your cart is empty. <Link to="/shop" className="text-cyan-600 underline">Continue Shopping</Link>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="bg-white rounded shadow-sm mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 px-4 py-4 border-b last:border-b-0">
                                <img
                                    src={getImageUrl(item.product.image)}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded border"
                                />
                                <div className="flex-1">
                                    <Link
                                        to={`/product/${item.product.id}`}
                                        className="text-sm font-medium text-cyan-600 hover:underline"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <div className="text-xs text-gray-500 mt-0.5">${item.product.price}</div>
                                    {item.size && (
                                        <div className="text-xs text-gray-400">Size: {item.size}</div>
                                    )}
                                </div>

                                {/* Quantity Input */}
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateCartQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 border border-gray-300 rounded text-center py-1 text-sm focus:outline-none focus:border-cyan-400"
                                />

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="bg-white rounded shadow-sm p-6 w-full md:w-72">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-3 border-b pb-3">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">${SHIPPING}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 text-base mb-4">
                                <span>Grand Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                            <Link
                                to="/checkout"
                                className="block text-center bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-medium transition-colors"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
