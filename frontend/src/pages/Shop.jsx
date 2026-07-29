import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { AppContext } from '../context/AppContext';

function Shop() {
    const { categories } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        axios.get('/brands').then(({ data }) => setBrands(data));
    }, []);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            const matched = categories.find(c => c.slug === cat);
            if (matched) {
                setSelectedCategory(matched.id);
            }
        }
        
        const brand = searchParams.get('brand');
        if (brand) {
            setSelectedBrand(brand);
        }
    }, [searchParams, categories]);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category_id = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        
        axios.get('/products', { params })
            .then(({ data }) => setProducts(data))
            .finally(() => setLoading(false));
    }, [selectedCategory, selectedBrand]);

    const handleCategoryClick = (id) => {
        setSelectedCategory(id === selectedCategory ? '' : id);
    };

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand === selectedBrand ? '' : brand);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb crumbs={[{ label: 'Home', path: '/' }, { label: 'Shop' }]} />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="w-full md:w-56 shrink-0">
                    <div className="bg-white rounded shadow-sm p-4 mb-4">
                        <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`text-sm w-full text-left py-1 px-2 rounded hover:text-cyan-600 transition-colors ${!selectedCategory ? 'text-cyan-600 font-medium' : 'text-gray-600'}`}
                                >
                                    All Products
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className={`text-sm w-full text-left py-1 px-2 rounded hover:text-cyan-600 transition-colors ${selectedCategory === cat.id ? 'text-cyan-600 font-medium' : 'text-gray-600'}`}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {brands.length > 0 && (
                        <div className="bg-white rounded shadow-sm p-4 mt-4">
                            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Brands</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setSelectedBrand('')}
                                        className={`text-sm w-full text-left py-1 px-2 rounded hover:text-cyan-600 transition-colors ${!selectedBrand ? 'text-cyan-600 font-medium' : 'text-gray-600'}`}
                                    >
                                        All Brands
                                    </button>
                                </li>
                                {brands.map((brand, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={() => handleBrandClick(brand)}
                                            className={`text-sm w-full text-left py-1 px-2 rounded hover:text-cyan-600 transition-colors ${selectedBrand === brand ? 'text-cyan-600 font-medium' : 'text-gray-600'}`}
                                        >
                                            {brand}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {selectedCategory
                                ? categories.find(c => c.id === selectedCategory)?.name
                                : 'All Products'}
                        </h2>
                        <span className="text-sm text-gray-500">{products.length} Products</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-200 rounded h-64 animate-pulse"></div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center text-gray-500 py-16">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;
