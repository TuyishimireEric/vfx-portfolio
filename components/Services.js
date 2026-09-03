'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { services as contentServices } from '@/lib/content';
import styles from './Services.module.css';

const defaultServices = contentServices;

export default function Services() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [services, setServices] = useState(defaultServices); // Default initially for hydration
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('id', { ascending: true });

                if (data && data.length > 0) {
                    setServices(data);
                }
            } catch (error) {
                console.log('Using default services');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleEditClick = (service) => {
        setEditingService(service.id);
        setServiceForm(service);
        setIsAdding(false);
    };

    const handleAddClick = () => {
        const newService = { title: '', desc: '', icon: '✨' };
        setServiceForm(newService);
        setIsAdding(true);
        setEditingService('new');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Check if we are adding or editing
            const { ...submitData } = serviceForm;
            if (isAdding) delete submitData.id;

            const { data, error } = await supabase
                .from('services')
                .upsert(submitData)
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

            if (isAdding) {
                setServices([...services, data[0]]);
            } else {
                setServices(services.map(s => s.id === serviceForm.id ? data[0] : s));
            }

            setEditingService(null);
            setServiceForm(null);
            setIsAdding(false);
            addToast('Service saved successfully!', 'success');
        } catch (error) {
            console.error('Error updating service:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <section className={styles.servicesSection} id="services">
            <div className="container">
                <div className={styles.headerSection}>
                    <h2 className={styles.sectionTitle}>SERVICES</h2>
                    {isAdmin && (
                        <button onClick={handleAddClick} className={styles.addBtn}>
                            <Plus size={16} />
                            Add New Service
                        </button>
                    )}
                </div>

                <div className={styles.servicesGrid}>
                    {services.map(service => (
                        <Link
                            key={service.id}
                            href={service.skillId ? `/projects/category/${service.skillId}` : '/#skills'}
                            className={`${styles.serviceItem} ${styles.serviceItemLink}`}
                        >
                            {isAdmin && (
                                <div className={styles.adminControls}>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditClick(service); }} className={styles.editBtn}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(service.id); }} className={styles.delBtn}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                            <div className={styles.iconContainer}>
                                <div className={styles.iconRing}></div>
                                <span className={styles.icon}>{service.icon}</span>
                            </div>
                            <div className={styles.serviceInfo}>
                                <h3 className={styles.serviceTitle}>{service.title}</h3>
                                <p className={styles.serviceDesc}>{service.desc}</p>
                            </div>
                            <div className={styles.divider}></div>
                        </Link>
                    ))}
                </div>
            </div>

            {editingService && serviceForm && (
                <div className={styles.editOverlay}>
                    <div className={styles.editForm}>
                        <div className={styles.editHeader}>
                            <h3>{isAdding ? 'Add New Service' : 'Edit Service'}</h3>
                            <button onClick={() => { setEditingService(null); setServiceForm(null); setIsAdding(false); }} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <input
                            value={serviceForm.icon}
                            onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                            placeholder="Icon (Emoji)"
                            className={styles.editInput}
                        />
                        <input
                            value={serviceForm.title}
                            onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                            placeholder="Service Title"
                            className={styles.editInput}
                        />
                        <textarea
                            value={serviceForm.desc}
                            onChange={e => setServiceForm({ ...serviceForm, desc: e.target.value })}
                            placeholder="Service Description"
                            className={styles.editTextarea}
                        />

                        <div className={styles.editActions}>
                            <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingService(null);
                                    setServiceForm(null);
                                    setIsAdding(false);
                                }}
                                className={styles.cancelBtn}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
