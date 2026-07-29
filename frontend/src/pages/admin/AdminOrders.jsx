import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Navigate, Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

function AdminOrders() {
    const { user } = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchAdminOrders();
    }, []);

    const fetchAdminOrders = async () => {
        try {
            const { data } = await axios.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching admin orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    return (
        <div>
            <AdminNav />
            <div className="container mx-auto px-4 pb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>

            {orders.length === 0 ? (
                <div className="text-gray-500 bg-white p-6 rounded shadow-sm text-center">
                    No orders found.
                </div>
            ) : (
                <div className="bg-white rounded shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {order.user?.name}
                                        <br/>
                                        <span className="text-xs text-gray-400">{order.user?.email}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.grand_total}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={updatingId === order.id}
                                            className={`text-sm border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500 ${updatingId === order.id ? 'opacity-50' : ''}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Link to={`/admin/orders/${order.id}`} className="text-cyan-600 hover:text-cyan-800 hover:underline font-medium">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    );
}

export default AdminOrders;
