import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGetStarted = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const renderButton = () => {
        if (location.pathname === '/') {
            return (
                <button onClick={handleGetStarted} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Get Started
                </button>
            );
        } else if (location.pathname !== '/login' && location.pathname !== '/signup') {
            return (
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
                    Logout
                </button>
            );
        }
        return null;
    };

    return (
        <nav className="bg-gray-800 p-4 text-white fixed top-0 left-0 w-full z-10 shadow-md" style={{height:"71px"}}>
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-xl flex-1 text-center">
                    Hospital's Availability System
                </Link>
                <div className="flex-shrink-0">
                    {renderButton()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;