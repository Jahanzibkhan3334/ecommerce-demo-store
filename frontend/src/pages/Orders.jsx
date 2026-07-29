import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function Orders() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        axios.get('/orders')
            .then(({ data }) => setOrders(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [user, navigate]);

    const statusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const fetchOrderDetails = async (id) => {
        if (expanded?.id === id) {
            setExpanded(null);
            return;
        }
        try {
            const { data } = await axios.get(`/orders/${id}`);
            setExpanded(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-52 shrink-0">
                    <div className="bg-white rounded shadow-sm p-4">
                        <ul className="space-y-1">
                            <li>
                                <Link to="/account" className="block px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded transition-colors">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="block px-3 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 rounded">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded transition-colors">
                                    Change Password
                                </button>
                            </li>
                            <li>
                                <Link to="/" className="block px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition-colors">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="flex-1 bg-white rounded shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">My Orders</h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No orders yet. <Link to="/shop" className="text-cyan-600 hover:underline">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <div key={order.id} className="border rounded overflow-hidden">
                                    <div
                                        className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => fetchOrderDetails(order.id)}
                                    >
                                        <div>
                                            <span className="font-medium text-sm text-gray-800">Order #{order.id}</span>
                                            <span className="ml-3 text-xs text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${statusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${statusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="font-bold text-sm text-gray-800">${order.grand_total}</span>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expanded?.id === order.id && (
                                        <div className="border-t px-4 py-4 bg-gray-50">
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                <div>
                                                    <p><span className="font-medium">Customer:</span> {expanded.name}</p>
                                                    <p><span className="font-medium">Email:</span> {expanded.email}</p>
                                                    <p><span className="font-medium">Phone:</span> {expanded.phone}</p>
                                                </div>
                                                <div>
                                                    <p><span className="font-medium">Address:</span> {expanded.address}</p>
                                                    <p><span className="font-medium">City:</span> {expanded.city}, {expanded.state} {expanded.zip}</p>
                                                    <p><span className="font-medium">Payment:</span> {expanded.payment_method}</p>
                                                </div>
                                            </div>
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-1 font-medium text-gray-600">Product</th>
                                                        <th className="text-left py-1 font-medium text-gray-600">Qty</th>
                                                        <th className="text-right py-1 font-medium text-gray-600">Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {expanded.items?.map(item => (
                                                        <tr key={item.id} className="border-b last:border-0">
                                                            <td className="py-1.5">{item.product?.name}</td>
                                                            <td className="py-1.5">{item.quantity}</td>
                                                            <td className="py-1.5 text-right">${item.price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="text-right text-sm mt-2 font-bold">
                                                Grand Total: ${expanded.grand_total}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Orders;
