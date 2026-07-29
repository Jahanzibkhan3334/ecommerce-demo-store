import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getImageUrl } from '../utils/helpers';

function ProductCard({ product }) {
    const { addToCart } = useContext(AppContext);
    const navigate = useNavigate();

    const handleAction = () => {
        if (product.type === 'variable') {
            navigate(`/product/${product.id}`);
        } else {
            addToCart(product.id, 1, null);
        }
    };

    return (
        <div className="bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <Link to={`/product/${product.id}`}>
                <div className="overflow-hidden rounded-t">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>
            <div className="p-3">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-gray-800 hover:text-cyan-600 transition-colors leading-tight mb-1">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-cyan-600 font-semibold text-sm">${product.price}</span>
                    {product.old_price && (
                        <span className="text-gray-400 line-through text-xs">${product.old_price}</span>
                    )}
                </div>
                <div className="mt-2 border-t pt-2">
                    <button
                        onClick={handleAction}
                        className="w-full text-xs bg-cyan-500 hover:bg-cyan-600 text-white py-1.5 rounded transition-colors"
                    >
                        {product.type === 'variable' ? 'Select Variation' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
