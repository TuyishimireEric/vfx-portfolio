'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Play } from 'lucide-react';
import { profile } from '@/lib/content';
import styles from './Nav.module.css';

const links = [
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#work', label: 'Work' },
    { href: '/#services', label: 'Services' },
    { href: '/#contact', label: 'Contact' },
];

export default function Nav() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
                    <span className={styles.brandMark}>JR</span>
                    <span className={styles.brandText}>{profile.name}</span>
                </Link>

                <nav className={`${styles.links} ${open ? styles.open : ''}`}>
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
                            {l.label}
                        </Link>
                    ))}
                    <a href={profile.showreelUrl} target="_blank" rel="noopener noreferrer" className={styles.reelBtn} onClick={() => setOpen(false)}>
                        <Play size={14} /> Showreel
                    </a>
                </nav>

                <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Toggle menu">
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </header>
    );
}
