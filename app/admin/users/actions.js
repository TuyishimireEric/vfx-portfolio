'use server';

import { getServiceSupabase } from '@/lib/supabase';

export async function createUser(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { message: 'Email and password are required', error: true };
    }

    if (password.length < 6) {
        return { message: 'Password must be at least 6 characters', error: true };
    }

    try {
        const supabase = getServiceSupabase();

        // Use the admin API to create a user without signing them in
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm email
        });

        if (error) throw error;

        return { message: `User ${email} created successfully!`, error: false };
    } catch (error) {
        console.error('Create user error:', error);
        return { message: error.message || 'Failed to create user', error: true };
    }
}
