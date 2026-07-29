import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import { getImageUrl } from '../../utils/helpers';

function AdminProducts() {
    const { user, fetchGlobalCategories } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        old_price: '',
        description: '',
        sku: '',
        brand: '',
        stock: 0,
        type: 'simple'
    });
    const [imageFile, setImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/admin/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/admin/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleGalleryChange = (e) => {
        setGalleryFiles(Array.from(e.target.files));
    };

    const handleDeleteGalleryImage = async (imgId) => {
        if (!window.confirm('Remove this gallery image?')) return;
        try {
            await axios.delete(`/admin/product-images/${imgId}`);
            // refresh product in editing state
            const { data } = await axios.get(`/admin/products/${editingProduct.id}`);
            setEditingProduct(data);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting gallery image', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });
        if (imageFile) {
            data.append('image', imageFile);
        }
        // Append gallery files
        galleryFiles.forEach(file => {
            data.append('gallery[]', file);
        });

        try {
            if (editingProduct) {
                data.append('_method', 'PUT');
                await axios.post(`/admin/products/${editingProduct.id}`, data);
            } else {
                await axios.post('/admin/products', data);
            }
            setShowForm(false);
            setEditingProduct(null);
            setImageFile(null);
            setGalleryFiles([]);
            fetchProducts();
            fetchGlobalCategories();
        } catch (error) {
            console.error('Error saving product', error);
            const msg = error.response?.data?.message || error.message;
            alert('Error saving product: ' + msg);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            old_price: product.old_price || '',
            description: product.description || '',
            sku: product.sku || '',
            brand: product.brand || '',
            stock: product.stock,
            type: product.type
        });
        setImageFile(null);
        setGalleryFiles([]);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`/admin/products/${id}`);
            fetchProducts();
            fetchGlobalCategories();
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', category_id: '', price: '', old_price: '',
            description: '', sku: '', brand: '', stock: 0, type: 'simple'
        });
        setImageFile(null);
        setGalleryFiles([]);
        setEditingProduct(null);
        setShowForm(false);
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <AdminNav />
            <div className="container mx-auto px-4 pb-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        Add New Product
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500">
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                                <input type="number" step="0.01" name="old_price" value={formData.old_price} onChange={handleInputChange} className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" className="w-full border-gray-300 rounded" />
                                {editingProduct && editingProduct.image && (
                                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">Current: <img src={getImageUrl(editingProduct.image)} className="h-16 rounded border" alt="Current" /></div>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Gallery (Multiple Images)</label>
                                <input type="file" onChange={handleGalleryChange} accept="image/*" multiple className="w-full border-gray-300 rounded" />
                                <p className="text-xs text-gray-500 mt-1">You can select multiple images. They will be added to the gallery without replacing existing ones.</p>
                                {/* Show existing gallery images with delete buttons */}
                                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-600 mb-2">Existing Gallery Images:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {editingProduct.images.map(img => (
                                                <div key={img.id} className="relative group">
                                                    <img src={getImageUrl(img.image_path)} className="w-16 h-16 object-cover rounded border" alt="gallery" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteGalleryImage(img.id)}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded">Save Product</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? <div className="text-center py-10">Loading products...</div> : (
                    <div className="bg-white rounded shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Image</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img src={getImageUrl(product.image)} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button onClick={() => handleEdit(product)} className="text-cyan-600 hover:text-cyan-900 mr-3">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default AdminProducts;
