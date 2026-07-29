import { Link, useLocation } from 'react-router-dom';

function AdminNav() {
    const location = useLocation();

    const links = [
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Categories', path: '/admin/categories' },
        { name: 'Slides', path: '/admin/slides' },
    ];

    return (
        <div className="bg-white shadow-sm mb-8 border-b">
            <div className="container mx-auto px-4">
                <nav className="flex space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                location.pathname.startsWith(link.path)
                                    ? 'border-cyan-500 text-cyan-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default AdminNav;
