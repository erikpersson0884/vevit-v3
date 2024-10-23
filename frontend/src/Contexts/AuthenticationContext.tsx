import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children, setUser }: { children: ReactNode, setUser: (user: User | null) => void }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('adminKey');
        if (!token) {
            return;
        }
        
        fetch(`${import.meta.env.VITE_API_URL}/auth/testAdminKey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminKey: token
            })
        })
        .then(response => {
            if (!response.ok) {
                localStorage.removeItem('adminKey');
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setIsAuthenticated(true);
            setUser(data.user);
        })

        if (token) {
        }
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('adminKey', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('adminKey');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
