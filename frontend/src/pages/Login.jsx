import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Login() {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid login details');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 bg-white placeholder-gray-400";

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="bg-white rounded shadow-md w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Login</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
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
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <Link to="/register" className="text-sm text-gray-500 hover:text-cyan-600 transition-colors">
                            Register Here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
