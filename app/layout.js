import './globals.css';
import Chatbot from '../components/Chatbot';
import { AdminProvider } from '@/context/AdminContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
    title: 'Jules Rukundo | VFX Technical Director',
    description: '3D & VFX Artist Portfolio - Futuristic Cinematic Interface',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <ToastProvider>
                    <AdminProvider>
                        <div className="fixed inset-0 z-[-1] pointer-events-none">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
                        </div>
                        <main className="min-h-screen flex flex-col">
                            {children}
                        </main>
                        <Chatbot />
                    </AdminProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
