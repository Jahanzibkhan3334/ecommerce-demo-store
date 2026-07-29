import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function MyAccount() {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '' });
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setForm({ name: user.name, email: user.email });
    }, [user, navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            await axios.put('/profile', form);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const inputClass = "w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-cyan-500 bg-transparent placeholder-gray-400";

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-52 shrink-0">
                    <div className="bg-white rounded shadow-sm p-4">
                        <ul className="space-y-1">
                            <li>
                                <Link to="/account" className="block px-3 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 rounded">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="block px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded transition-colors">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded transition-colors">
                                    Change Password
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="flex-1 bg-white rounded shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-3">My Account</h2>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Name</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Address</label>
                            <input name="address" placeholder="Address" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Phone</label>
                                <input name="phone" placeholder="Phone" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">City</label>
                                <input name="city" placeholder="City" className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">State</label>
                                <input name="state" placeholder="State" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Zip</label>
                                <input name="zip" placeholder="Zip" className={inputClass} />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white px-8 py-2 rounded text-sm font-medium transition-colors"
                            >
                                {loading ? 'Saving...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
