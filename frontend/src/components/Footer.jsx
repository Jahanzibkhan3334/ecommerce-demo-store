import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

function Footer() {
    const { categories } = useContext(AppContext);
    const footerCategories = categories.slice(0, 5);

    return (
        <footer className="bg-[#2c3e50] text-gray-300 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-600 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-xl font-bold text-cyan-400 mb-4">
                            <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[#2c3e50] text-xs">P</div>
                            Pure Wear
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Nulla incidunt eaque.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            {footerCategories.map((cat) => (
                                <li key={cat.id}>
                                    <Link to={`/shop?category=${cat.slug}`} className="hover:text-cyan-400 transition-colors capitalize">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
                        <ul className="space-y-2 text-sm">
                            <li>+91-95XXXXXXX</li>
                            <li>info@example.com</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm mb-6 text-gray-400">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <FaTruck className="text-xl" /> Free Delivery
                    </div>
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <FaMoneyBillWave className="text-xl" /> Money Back Guarantee
                    </div>
                    <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-xl" /> Secure Payments
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500">
                    © 2024 All Right Reserved
                </div>
            </div>
        </footer>
    );
}

export default Footer;
