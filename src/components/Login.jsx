import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
// import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [role, setRole] = useState('');
    const navigate = useNavigate();
    // const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sending login request
            const response = await axios.post('/auth/login', { email, password });



            localStorage.setItem('token', response.data);


            // Store role in the auth context (if role is set during signup and stored in localStorage or passed)
            // login(role || localStorage.getItem('role'));

            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow-2xl" style={{ width: "600px" }} onSubmit={handleLogin}>
                <h2 className="text-2xl mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* <div className="mb-4">
                    <label htmlFor="role" className="block mb-2">Role</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div> */}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
                <div className="mt-4 text-right">
                    <span>New user? </span>
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-500 underline"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
