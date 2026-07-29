import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAppLoading, setIsAppLoading] = useState(true);
    
    // Base URL for API
    axios.defaults.baseURL = 'http://localhost:8000/api';

    // Set token synchronously so child components can use it on first render
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        const initAuth = async () => {
            await fetchGlobalCategories();
            if (token) {
                await fetchUser();
                await fetchCart();
            }
            setIsAppLoading(false);
        };
        initAuth();
    }, []);

    const fetchGlobalCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories in context', error);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/user');
            setUser(data);
        } catch (error) {
            console.error('Error fetching user', error);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const fetchCart = async () => {
        try {
            const { data } = await axios.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart', error);
        }
    };

    const addToCart = async (productId, quantity = 1, size = null) => {
        if (!user) {
            alert('Please login first');
            return;
        }
        try {
            await axios.post('/cart', { product_id: productId, quantity, size });
            fetchCart();
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`/cart/${cartId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing from cart', error);
        }
    };

    const updateCartQuantity = async (cartId, quantity) => {
        try {
            await axios.put(`/cart/${cartId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error('Error updating cart', error);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post('/login', { email, password });
        localStorage.setItem('token', data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        setUser(data.user);
        await fetchCart();
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('/register', { name, email, password });
        localStorage.setItem('token', data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error(error);
        }
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setCart([]);
    };

    if (isAppLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
    }

    return (
        <AppContext.Provider value={{
            user, cart, categories, login, register, logout, addToCart, removeFromCart, updateCartQuantity, fetchCart, fetchGlobalCategories
        }}>
            {children}
        </AppContext.Provider>
    );
};
