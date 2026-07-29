import { Link } from 'react-router-dom';

function Breadcrumb({ crumbs }) {
    return (
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            {crumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                    {index > 0 && <span>/</span>}
                    {crumb.path ? (
                        <Link to={crumb.path} className="hover:text-cyan-600 transition-colors">{crumb.label}</Link>
                    ) : (
                        <span className="text-gray-700">{crumb.label}</span>
                    )}
                </span>
            ))}
        </div>
    );
}

export default Breadcrumb;
