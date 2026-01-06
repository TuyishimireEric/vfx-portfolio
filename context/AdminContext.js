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
        const checkAdminRole = async (session) => {
            if (!session?.user) {
                setIsAdmin(false);
                return;
            }

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
                // Fallback to email check if roles table is empty or connection fails (optional safety net, or removed as requested?)
                // User said "no need to check on specific emails". I will strictly follow that.
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
