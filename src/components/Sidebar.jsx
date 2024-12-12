import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/'); // Navigate to the home page ("/")
    };

    return (
        <div className="w-64 bg-gray-800 text-white h-full" style={{ height: "100vh", padding: "10px 50px", fontSize: "20px" }}>
            <ul>
                <li className="pb-4">
                    <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="pb-4">
                    <Link to="/hospitals" className="hover:text-gray-400">Hospitals</Link>
                </li>
                <li className="pb-4">
                    <Link to="/doctors" className="hover:text-gray-400">Doctors</Link>
                </li>
                <li className="pb-4">
                    <Link to="/beds" className="hover:text-gray-400">Beds</Link>
                </li>
                <li className="pb-4 cursor-pointer">
                    <span onClick={handleLogout} className="hover:text-gray-400">Logout</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
