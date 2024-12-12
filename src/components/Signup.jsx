import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/signup', { email, password, role });
            localStorage.setItem('token', response.data.token);
            login(role || localStorage.getItem('role'));
            console.log(role)
            navigate('/login');
        } catch (error) {
            console.error('Signup failed', error.response || error);
            alert('Registration failed');
        }
    };


    return (
        <div className="h-screen flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow-2xl" style={{ height: "360px" }} onSubmit={handleSignup}>
                <h2 className="text-2xl mb-6">Signup</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    className="w-full p-2 mb-2 border rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" className="w-full mt-5 bg-green-500 text-white p-2 rounded">
                    Signup
                </button>
                <div className="mt-4 text-right">
                    <span>Already registered? </span>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 underline"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
