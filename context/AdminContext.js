'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/admin/AuthModal';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Jules's email gets full administrative access
        const ADMIN_EMAILS = [
            'julesrukundo12@gmail.com',
            (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase().trim(),
        ].filter(Boolean);

        // Check active session
        const checkAdminRole = async (session) => {
            if (!session?.user) {
                setUser(null);
                setIsAdmin(false);
                return;
            }

            setUser(session.user);
            const userEmail = session.user.email?.toLowerCase().trim();

            // Direct check for owner email
            if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
                setIsAdmin(true);
                return;
            }

            // Also check role from database if available
            try {
                const { data: userRoles, error } = await supabase
                    .from('user_roles')
                    .select('roles(name)')
                    .eq('user_id', session.user.id);

                if (error) {
                    console.error('Error fetching roles:', error);
                    setIsAdmin(false);
                    return;
                }

                const roles = userRoles?.map(r => r.roles?.name) || [];
                setIsAdmin(roles.includes('admin'));
            } catch (err) {
                console.error('Admin check failed:', err);
                setIsAdmin(false);
            }
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
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, user, openAuthModal, closeAuthModal, logout }}>
            {children}
            {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);
