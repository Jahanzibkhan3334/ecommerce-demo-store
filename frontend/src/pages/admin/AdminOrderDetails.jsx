import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getImageUrl } from '../../utils/helpers';

function AdminOrderDetails() {
    const { user } = useContext(AppContext);
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await axios.get(`/admin/orders/${id}`);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            await axios.put(`/admin/orders/${id}/status`, { status: newStatus });
            setOrder({ ...order, status: newStatus });
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (loading) return <div className="text-center py-20">Loading order details...</div>;
    if (!order) return <div className="text-center py-20 text-red-500">Order not found</div>;

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <Link to="/admin/orders" className="text-cyan-600 hover:underline mb-6 inline-block font-medium">&larr; Back to Orders</Link>
            
            <div className="bg-white rounded shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
                        <p className="text-gray-500 text-sm mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Change Status:</span>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updating}
                            className={`border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500 text-sm ${updating ? 'opacity-50' : ''}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
                            <p><span className="font-medium">Name:</span> {order.name}</p>
                            <p><span className="font-medium">Email:</span> {order.email}</p>
                            <p><span className="font-medium">Phone:</span> {order.phone}</p>
                            <p><span className="font-medium">Account ID:</span> {order.user_id}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
                            <p>{order.address}</p>
                            <p>{order.city}, {order.state} {order.zip}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border border-gray-100 rounded">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Product</th>
                                    <th className="px-4 py-3 font-medium">Size</th>
                                    <th className="px-4 py-3 font-medium text-center">Price</th>
                                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                                    <th className="px-4 py-3 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items?.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-3">
                                                <img src={getImageUrl(item.product?.image)} alt={item.product?.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                                                <span className="font-medium text-gray-800">{item.product?.name || 'Unknown Product'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.size || 'N/A'}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">${Number(item.price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-800">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <div className="w-full md:w-1/2 ml-auto space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${Number(order.total).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>${Number(order.shipping_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-100">
                            <span>Grand Total</span>
                            <span className="text-cyan-600">${Number(order.grand_total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminOrderDetails;
