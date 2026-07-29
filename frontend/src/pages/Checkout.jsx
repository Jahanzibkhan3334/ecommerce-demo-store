import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Breadcrumb from '../components/Breadcrumb';
import { getImageUrl } from '../utils/helpers';

const SHIPPING = 6;

function Checkout() {
    const { cart, user, fetchCart } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const grandTotal = subtotal + SHIPPING;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login first');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post('/orders', {
                ...form,
                payment_method: paymentMethod,
                shipping_cost: SHIPPING
            });
            fetchCart();
            navigate('/thank-you', { state: { order: data } });
        } catch (error) {
            console.error('Checkout error', error);
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-cyan-500 bg-transparent placeholder-gray-400";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb crumbs={[{ label: 'Home', path: '/' }, { label: 'Checkout' }]} />

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Billing Details */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800 mb-5">Billing Details</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    required
                                    className={inputClass}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Address"
                                required
                                className={inputClass}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                    className={inputClass}
                                />
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="zip"
                                    value={form.zip}
                                    onChange={handleChange}
                                    placeholder="Zip"
                                    required
                                    className={inputClass}
                                />
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full md:w-72 shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800 mb-5">Items</h2>

                        <div className="space-y-3 mb-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <img
                                        src={getImageUrl(item.product.image)}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded border"
                                    />
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-700">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">${item.product.price} × {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-3 space-y-1 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>${SHIPPING}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t">
                                <span>Grand Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Methods</h3>
                            <div className="flex items-center gap-4 text-sm">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Stripe"
                                        checked={paymentMethod === 'Stripe'}
                                        onChange={() => setPaymentMethod('Stripe')}
                                        className="accent-cyan-500"
                                    />
                                    Stripe
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                        className="accent-cyan-500"
                                    />
                                    COD
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.length === 0}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white py-2 rounded font-medium transition-colors"
                        >
                            {loading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
