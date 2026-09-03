'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, LogOut, CheckCircle2 } from 'lucide-react';
import styles from './AuthModal.module.css';
import { createUser } from '@/app/admin/users/actions';
import { useAdmin } from '@/context/AdminContext';

export default function AuthModal({ onClose }) {
    const { user, isAdmin, logout } = useAdmin();
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setMessage('');
        setError(false);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
                },
            });
            if (error) throw error;
        } catch (err) {
            setError(true);
            setMessage(err.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError(false);

        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose(); // Close on success
            } else {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                const result = await createUser(null, formData);
                if (result.error) throw new Error(result.message);

                setMessage(result.message);
            }
        } catch (err) {
            setError(true);
            setMessage(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>System Access</h2>
                    <p className={styles.subtitle}>
                        {user ? 'Current Active Session' : 'Sign in to access system features'}
                    </p>
                </div>

                {user ? (
                    <div className={styles.loggedInBox}>
                        <div className={styles.userStatusHeader}>
                            <CheckCircle2 size={18} className={styles.userCheckIcon} />
                            <span className={styles.userEmail}>{user.email}</span>
                        </div>
                        <p className={styles.roleTag}>
                            {isAdmin ? '👑 Full Administrative Access' : '✉️ Standard Access — Contact Form Enabled'}
                        </p>
                        <div className={styles.sessionActions}>
                            <button
                                onClick={async () => {
                                    await logout();
                                }}
                                className={styles.logoutBtn}
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                            <button onClick={onClose} className={styles.continueBtn}>
                                Continue
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className={styles.googleBtn}
                        >
                            <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className={styles.divider}>
                            <span>or credentials</span>
                        </div>

                        {/* Public self-registration is disabled: admin access is granted by
                            owner email only. Set NEXT_PUBLIC_ALLOW_REGISTER=true to re-enable. */}
                        {process.env.NEXT_PUBLIC_ALLOW_REGISTER === 'true' && (
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
                                    onClick={() => setMode('login')}
                                >
                                    Login
                                </button>
                                <button
                                    className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
                                    onClick={() => setMode('register')}
                                >
                                    Register
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {message && (
                                <div className={`${styles.message} ${error ? styles.error : styles.success}`}>
                                    {message}
                                </div>
                            )}

                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Email Command"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    placeholder="Access Code"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={styles.input}
                                />
                            </div>

                            <button type="submit" disabled={loading} className={styles.submitBtn}>
                                {loading ? 'Processing...' : (mode === 'login' ? 'Authenticate' : 'Register User')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
