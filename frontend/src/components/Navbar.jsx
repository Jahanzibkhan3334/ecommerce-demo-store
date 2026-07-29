import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaYoutube, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

function Navbar() {
    const { user, cart, categories } = useContext(AppContext);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const navCategories = categories.slice(0, 5);

    return (
        <header className="bg-white shadow-sm border-b">
            {/* Top Bar */}
            <div className="bg-[#2c3e50] text-white text-center text-sm py-2">
                Shipping Worldwide
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-cyan-500">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs">P</div>
                    Pure Wear
                </Link>

                <nav className="hidden md:flex gap-6 font-medium text-gray-700">
                    {navCategories.map((cat) => (
                        <Link 
                            key={cat.id} 
                            to={`/shop?category=${cat.slug}`} 
                            className="hover:text-cyan-500 transition-colors capitalize"
                        >
                            {cat.name}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link to="/admin/orders" className="text-orange-500 hover:text-orange-600 transition-colors border-l pl-6 border-gray-300">Manage Orders</Link>
                    )}
                </nav>

                <div className="flex items-center gap-4 text-gray-600">
                    <Link to={user ? "/account" : "/login"} className="hover:text-cyan-500 transition-colors text-xl">
                        <FaUser />
                    </Link>
                    <Link to="/cart" className="relative hover:text-cyan-500 transition-colors text-xl">
                        <FaShoppingCart />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
