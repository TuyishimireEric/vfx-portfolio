'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { profile } from '@/lib/content';
import AuthModal from '@/components/admin/AuthModal';

const AdminContext = createContext();

// Only the site owner's Google account gets edit access. Anyone else who
// signs in (or nobody at all) can still browse and use the contact form —
// that part of the site never required a login.
const OWNER_EMAIL = profile.email.toLowerCase();

export function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Check active session — admin is granted purely by matching the
        // signed-in Google account's email against the owner's email above.
        const checkAdminRole = async (session) => {
            const email = session?.user?.email?.toLowerCase();
            setIsAdmin(!!email && email === OWNER_EMAIL);
        };

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            checkAdminRole(session);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkAdminRole(session);
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
