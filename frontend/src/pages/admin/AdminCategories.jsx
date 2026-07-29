import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

function AdminCategories() {
    const { user, fetchGlobalCategories } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/admin/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`/admin/categories/${editingCategory.id}`, formData);
            } else {
                await axios.post('/admin/categories', formData);
            }
            setShowForm(false);
            setEditingCategory(null);
            fetchCategories();
            fetchGlobalCategories();
        } catch (error) {
            console.error('Error saving category', error);
            const msg = error.response?.data?.message || error.message;
            alert('Error saving category: ' + msg);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? Products in this category might be affected.')) return;
        try {
            await axios.delete(`/admin/categories/${id}`);
            fetchCategories();
            fetchGlobalCategories();
        } catch (error) {
            console.error('Error deleting category', error);
            const msg = error.response?.data?.message || error.message;
            alert('Error deleting category: ' + msg);
        }
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setEditingCategory(null);
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
                    <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        Add New Category
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded shadow-sm mb-8 max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g. Electronics" />
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded">Save Category</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? <div className="text-center py-10">Loading categories...</div> : (
                    <div className="bg-white rounded shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(category)} className="text-cyan-600 hover:text-cyan-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default AdminCategories;
