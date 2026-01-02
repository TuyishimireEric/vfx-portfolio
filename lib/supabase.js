import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are not set
// This allows the app to run without Supabase configured
const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase environment variables not configured. Using mock client.');
        // Return a mock client that won't crash the app
        return {
            from: () => ({
                select: () => Promise.resolve({ data: [], error: null }),
                insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            }),
            storage: {
                from: () => ({
                    upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } }),
                }),
            },
            auth: {
                signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                signOut: () => Promise.resolve({ error: null }),
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
        };
    }
    return createClient(supabaseUrl, supabaseAnonKey);
};

// Client for browser/client-side usage
export const supabase = createSupabaseClient();

// Server-side client with service role (for admin operations)
export const getServiceSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey || !supabaseUrl) {
        console.warn('⚠️ Supabase service role not configured');
        return supabase; // Return the mock client
    }
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
