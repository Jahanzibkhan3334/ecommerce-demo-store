import { useLocation, Link } from 'react-router-dom';

function ThankYou() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">No order found.</h2>
                <Link to="/" className="text-cyan-600 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-cyan-600 mb-2">Thank You!</h1>
                <p className="text-gray-500">You have successfully placed your order.</p>
            </div>

            <div className="bg-white rounded shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                        <p><span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p>
                            <span className="font-medium">Status:</span>{' '}
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-medium capitalize">{order.status}</span>
                        </p>
                        <p><span className="font-medium">Payment:</span> {order.payment_method}</p>
                    </div>
                    <div>
                        <p><span className="font-medium">Customer:</span> {order.name}</p>
                        <p><span className="font-medium">Address:</span> {order.address}, {order.city}, {order.state}, {order.zip}</p>
                        <p><span className="font-medium">Contact:</span> {order.phone}</p>
                    </div>
                </div>

                <h3 className="font-semibold text-gray-700 mt-4 mb-2">Items</h3>
                <table className="w-full text-sm text-left mb-4">
                    <thead className="border-b">
                        <tr>
                            <th className="py-2 font-medium text-gray-600">Item</th>
                            <th className="py-2 font-medium text-gray-600">Quantity</th>
                            <th className="py-2 font-medium text-gray-600 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map(item => (
                            <tr key={item.id} className="border-b last:border-b-0">
                                <td className="py-2 text-gray-700">{item.product?.name}</td>
                                <td className="py-2 text-gray-600">{item.quantity}</td>
                                <td className="py-2 text-gray-700 text-right">${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right text-sm space-y-1">
                    <p>Subtotal <span className="ml-4 font-medium">${parseFloat(order.total).toFixed(2)}</span></p>
                    <p>Shipping <span className="ml-4 font-medium">${parseFloat(order.shipping_cost).toFixed(2)}</span></p>
                    <p className="font-bold text-base">Grand Total <span className="ml-4">${parseFloat(order.grand_total).toFixed(2)}</span></p>
                </div>

                <div className="flex justify-center gap-4 mt-6 border-t pt-4">
                    <Link
                        to="/orders"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded text-sm font-medium transition-colors"
                    >
                        View Order Details
                    </Link>
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-800 px-5 py-2 rounded text-sm font-medium border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ThankYou;
