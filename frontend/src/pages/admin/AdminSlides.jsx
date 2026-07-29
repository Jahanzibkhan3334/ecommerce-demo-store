import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';

function AdminSlides() {
    const { user } = useContext(AppContext);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        image: null
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const { data } = await axios.get('/slides');
            setSlides(data);
        } catch (error) {
            console.error('Error fetching slides', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('title', formData.title);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editingSlide) {
                // To support file uploads via PUT/POST in Laravel, we use POST with optional image
                await axios.post(`/admin/slides/${editingSlide.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/admin/slides', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowForm(false);
            setEditingSlide(null);
            fetchSlides();
        } catch (error) {
            console.error('Error saving slide', error);
            const msg = error.response?.data?.message || error.message;
            alert('Error saving slide: ' + msg);
        }
    };

    const handleEdit = (slide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,
            image: null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return;
        try {
            await axios.delete(`/admin/slides/${id}`);
            fetchSlides();
        } catch (error) {
            console.error('Error deleting slide', error);
            const msg = error.response?.data?.message || error.message;
            alert('Error deleting slide: ' + msg);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', image: null });
        setEditingSlide(null);
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
                    <h1 className="text-3xl font-bold text-gray-800">Manage Slider</h1>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        Add New Slide
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded shadow-sm mb-8 max-w-lg border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slide Title</label>
                                <textarea 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleInputChange} 
                                    required 
                                    rows="2"
                                    className="w-full border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500" 
                                    placeholder="e.g. Simple&#10;is More" 
                                />
                                <p className="text-xs text-gray-500 mt-1">Press enter to add line breaks in the title.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slide Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                    required={!editingSlide}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" 
                                />
                                {editingSlide && (
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image.</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors">Save Slide</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? <div className="text-center py-10 text-gray-500">Loading slides...</div> : (
                    <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {slides.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-gray-500">No slides configured. Add a slide to get started.</td>
                                    </tr>
                                ) : (
                                    slides.map(slide => (
                                        <tr key={slide.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img 
                                                    src={slide.image_url} 
                                                    alt={slide.title} 
                                                    className="w-24 h-12 object-cover rounded border border-gray-100 shadow-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-pre-line">{slide.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleEdit(slide)} className="text-cyan-600 hover:text-cyan-900 mr-4">Edit</button>
                                                <button onClick={() => handleDelete(slide.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminSlides;
