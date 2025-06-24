import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User,signOut } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { router } from 'expo-router';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            if (user ===null){
                router.push('/(auth)/welcome');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
