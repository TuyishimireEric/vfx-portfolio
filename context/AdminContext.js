'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/admin/AuthModal';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Check active session
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdmin(!!session && (!adminEmail || session.user.email === adminEmail));
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAdmin(!!session && (!adminEmail || session.user.email === adminEmail));
        });

        return () => subscription.unsubscribe();
    }, []);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);
    const logout = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, openAuthModal, closeAuthModal, logout }}>
            {children}
            {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);
