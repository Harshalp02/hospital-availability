import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Initialize user from localStorage on component mount
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role) {
            setUser({ role });
        }
    }, []);

    const login = (role) => {
        setUser({ role });
        console.log(role);
        localStorage.setItem('role', role); // Save role to localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('role'); // Remove role from localStorage
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
