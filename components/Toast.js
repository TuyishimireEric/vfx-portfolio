'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertCircle size={20} />
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.icon}>
                {icons[type] || icons.success}
            </div>
            <div className={styles.message}>{message}</div>
            <button onClick={handleClose} className={styles.closeBtn}>
                <X size={16} />
            </button>
        </div>
    );
}
