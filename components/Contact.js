'use client';
import { useState, useEffect } from 'react';
import { Lock, LogOut, Edit2, Save, X, Loader2 } from 'lucide-react';
import styles from './Contact.module.css';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { contact as defaultContact, socials, profile, SITE_URL } from '@/lib/content';

export default function Contact() {
    const { isAdmin, openAuthModal, logout } = useAdmin();
    const { addToast } = useToast();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [contactInfo, setContactInfo] = useState(defaultContact);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('contact_info')
                    .select('*')
                    .single();

                if (data) {
                    setContactInfo({
                        email: data.email || defaultContact.email,
                        phone: data.phone || defaultContact.phone,
                    });
                }
            } catch (error) {
                console.log('Using default contact info');
            } finally {
                setLoading(false);
            }
        };
        fetchContactInfo();
    }, []);

    const handleEditClick = () => {
        setEditForm(contactInfo);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('contact_info')
                .upsert({
                    id: 1,
                    ...editForm,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

            setContactInfo(editForm);
            setIsEditing(false);
            addToast('Contact info updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating contact info:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setStatus('success');
                addToast('Message sent — thank you!', 'success');
                e.target.reset();
                setTimeout(() => setStatus(''), 4000);
            } else if (res.status === 503) {
                // Form service not configured yet: hand off to the visitor's email client
                const subject = encodeURIComponent(`Portfolio enquiry from ${payload.name}`);
                const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
                window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
                setStatus('');
            } else {
                setStatus('error');
                addToast(data.error || 'Failed to send message. Please email directly.', 'error');
            }
        } catch (error) {
            setStatus('error');
            addToast('Failed to send message. Please email directly.', 'error');
        }
    };

    return (
        <section className={styles.contactSection} id="contact">
            <div className="container" style={{ position: 'relative' }}>
                <h2 className={styles.sectionTitle}>GET IN TOUCH</h2>

                {isAdmin && (
                    <button onClick={handleEditClick} className={styles.editBtn}>
                        <Edit2 size={16} /> Edit Info
                    </button>
                )}

                <div className={styles.contactWrapper}>
                    <div className={styles.contactCard}>
                        {/* Left Column: Info */}
                        <div className={styles.infoColumn}>
                            <div className={styles.qrContainer}>
                                <img src="/qr.svg" alt={`QR code — ${SITE_URL}`} className={styles.qrCode} width={200} height={200} />
                                <p className={styles.qrLabel}>Scan to visit portfolio</p>
                            </div>

                            <div className={styles.contactDetails}>
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>EMAIL</span>
                                    <a href={`mailto:${contactInfo.email}`} className={styles.value}>{contactInfo.email}</a>
                                </div>
                                {contactInfo.phone && (
                                    <div className={styles.detailItem}>
                                        <span className={styles.label}>PHONE</span>
                                        <span className={styles.value}>{contactInfo.phone}</span>
                                    </div>
                                )}
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>BASED IN</span>
                                    <span className={styles.value}>{profile.location} · {profile.availability}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>SOCIAL</span>
                                    <div className={styles.socialLinks}>
                                        {socials.map((s) => (
                                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>{s.label}</a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className={styles.formColumn}>
                            <form className={styles.contactForm} onSubmit={handleSubmit}>
                                <h3 className={styles.formTitle}>SEND MESSAGE</h3>
                                <input type="text" name="website" tabIndex="-1" autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true" />
                                <div className={styles.formGroup}>
                                    <input type="text" name="name" placeholder="NAME" required className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="email" name="email" placeholder="EMAIL" required className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <textarea name="message" placeholder="MESSAGE" required className={styles.textarea}></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                                    {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                                </button>
                                {status === 'success' && <p className={styles.successMsg}>MESSAGE RECEIVED — I'LL REPLY SOON</p>}
                                {status === 'error' && <p className={styles.errorMsg}>SENDING FAILED — PLEASE EMAIL DIRECTLY</p>}
                            </form>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <p>&copy; {new Date().getFullYear()} Jules Rukundo. All rights reserved.</p>
                        <div className={styles.techStack}>
                            Houdini FX Artist — Kigali, Rwanda · Remote worldwide
                        </div>
                        {isAdmin ? (
                            <button onClick={logout} className={styles.adminLink}>
                                <LogOut size={12} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button onClick={openAuthModal} className={styles.adminLink}>
                                <Lock size={12} />
                                <span>System Access</span>
                            </button>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.editOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>Edit Contact Info</h3>
                                <button onClick={() => setIsEditing(false)} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <input
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                placeholder="Email Address"
                                className={styles.editInput}
                            />
                            <input
                                value={editForm.phone}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                placeholder="Phone Number"
                                className={styles.editInput}
                            />

                            <div className={styles.editActions}>
                                <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.backgroundOrnaments}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
            </div>
        </section>
    );
}
