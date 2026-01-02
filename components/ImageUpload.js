'use client';

import { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ currentImage, onImageUploaded, label = "Upload Image" }) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImage);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'vfx_portfolio');

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;

            setPreviewUrl(imageUrl);
            onImageUploaded(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl('');
        onImageUploaded('');
    };

    return (
        <div className={styles.uploadContainer}>
            <label className={styles.label}>{label}</label>

            {previewUrl ? (
                <div className={styles.preview}>
                    <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className={styles.removeBtn}
                        disabled={uploading}
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className={styles.uploadBox}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className={styles.fileInput}
                    />
                    {uploading ? (
                        <div className={styles.uploadContent}>
                            <Loader2 size={32} className="animate-spin" />
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <div className={styles.uploadContent}>
                            <Upload size={32} />
                            <span>Click to upload image</span>
                            <span className={styles.hint}>PNG, JPG, GIF up to 10MB</span>
                        </div>
                    )}
                </label>
            )}
        </div>
    );
}
