import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import { AppContext } from '../context/AppContext';
import { getImageUrl } from '../utils/helpers';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addToCart } = useContext(AppContext);

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        setLoading(true);
        axios.get(`/products/${id}`)
            .then(({ data }) => {
                setProduct(data);
                setSelectedImage(data.image);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8 animate-pulse">
                    <div className="w-96 h-96 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return <div className="text-center py-16 text-gray-500">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb crumbs={[
                { label: 'Home', path: '/' },
                { label: 'Shop', path: '/shop' },
                { label: product.name }
            ]} />

            <div className="bg-white rounded shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Image Gallery */}
                    <div className="w-full md:w-80 shrink-0">
                        <img
                            src={getImageUrl(selectedImage)}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded border"
                        />
                        {/* Thumbnails: main image + gallery images */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <img
                                src={getImageUrl(product.image)}
                                alt="main"
                                onClick={() => setSelectedImage(product.image)}
                                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-colors ${
                                    selectedImage === product.image ? 'border-cyan-500' : 'border-gray-200 hover:border-cyan-300'
                                }`}
                            />
                            {product.images && product.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={getImageUrl(img.image_path)}
                                    alt="gallery"
                                    onClick={() => setSelectedImage(img.image_path)}
                                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-colors ${
                                        selectedImage === img.image_path ? 'border-cyan-500' : 'border-gray-200 hover:border-cyan-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">(5.0)</span>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl font-bold text-cyan-600">${product.price}</span>
                            {product.old_price && (
                                <span className="text-lg text-gray-400 line-through">${product.old_price}</span>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm mb-5 leading-relaxed">{product.description}</p>

                        {/* Size Selection */}
                        {product.type === 'variable' && (
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-3 py-1.5 border text-sm rounded transition-colors ${
                                                selectedSize === size
                                                    ? 'border-cyan-500 bg-cyan-500 text-white'
                                                    : 'border-gray-300 text-gray-600 hover:border-cyan-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-sm font-semibold text-gray-700">Qty:</span>
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-3 py-1 border-r text-gray-600 hover:bg-gray-100"
                                >-</button>
                                <span className="px-4 py-1 text-sm">{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="px-3 py-1 border-l text-gray-600 hover:bg-gray-100"
                                >+</button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => addToCart(product.id, qty, product.type === 'simple' ? null : selectedSize)}
                            disabled={product.type === 'variable' && !selectedSize}
                            className={`px-8 py-2.5 rounded font-medium transition-colors text-white ${
                                product.type === 'variable' && !selectedSize
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-cyan-500 hover:bg-cyan-600'
                            }`}
                        >
                            Add to Cart
                        </button>

                        {(product.sku || product.brand) && (
                            <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex flex-col gap-1">
                                {product.sku && <div><span className="font-medium">SKU:</span> {product.sku}</div>}
                                {product.brand && <div><span className="font-medium">Brand:</span> {product.brand}</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
