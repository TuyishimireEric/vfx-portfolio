'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Lock } from 'lucide-react';
import styles from './AuthModal.module.css';

export default function AuthModal({ onClose }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleGoogleLogin = async () => {
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
            // Supabase redirects to Google — the page will reload on return,
            // so there's nothing else to do here on success.
        } catch (err) {
            setError(true);
            setMessage(err.message || 'Google sign-in is not available right now.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <X size={20} />
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>System Access</h2>
                    <p className={styles.subtitle}>
                        Sign in with Google. The site owner's account unlocks editing —
                        everyone else can still browse and use the contact form freely.
                    </p>
                </div>

                <div className={styles.form}>
                    {message && (
                        <div className={`${styles.message} ${error ? styles.error : styles.success}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className={styles.googleBtn}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
                            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z" />
                            <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" />
                            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" />
                        </svg>
                        {loading ? 'Redirecting…' : 'Continue with Google'}
                    </button>

                    <div className={styles.inputGroup}>
                        <Lock size={12} />
                        <span className={styles.hint}>Only julesrukundo12@gmail.com gets edit access.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
