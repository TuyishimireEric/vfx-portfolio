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

        // Assign 'user' role
        if (data.user) {
            const { data: roleData, error: roleError } = await supabase
                .from('roles')
                .select('id')
                .eq('name', 'user')
                .single();

            if (roleError) {
                console.error('Error fetching user role:', roleError);
            } else if (roleData) {
                const { error: assignError } = await supabase
                    .from('user_roles')
                    .insert({
                        user_id: data.user.id,
                        role_id: roleData.id
                    });

                if (assignError) {
                    console.error('Error assigning role:', assignError);
                }
            }
        }

        if (error) throw error;

        return { message: `User ${email} created successfully!`, error: false };
    } catch (error) {
        console.error('Create user error:', error);
        return { message: error.message || 'Failed to create user', error: true };
    }
}
