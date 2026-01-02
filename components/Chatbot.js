'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'System initialized. I am your VFX Assistant. How can I help you navigate this portfolio?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const toggleMinimize = (e) => {
        e.stopPropagation();
        setIsMinimized(!isMinimized);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const botMsg = { role: 'bot', text: generateResponse(input) };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const generateResponse = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('contact') || lower.includes('email')) return 'You can reach Jules at contact@julesrukundo.com or use the form in the Contact section.';
        if (lower.includes('houdini') || lower.includes('software')) return 'Jules is an expert in Houdini, specializing in Pyro, RBD, and procedural systems.';
        if (lower.includes('project') || lower.includes('work')) return 'Check out the "Featured Works" section to see the latest breakdown of Neon Dystopia and other projects.';
        return 'I am a portfolio assistant. I can help you find specific skills, projects, or contact information.';
    };

    if (!isOpen) {
        return (
            <button className={styles.launcher} onClick={toggleChat}>
                <MessageSquare size={24} />
                <span className={styles.launcherText}>AI ASSISTANT</span>
            </button>
        );
    }

    return (
        <div className={`${styles.chatWindow} ${isMinimized ? styles.minimized : ''}`}>
            <div className={styles.header} onClick={toggleMinimize}>
                <div className={styles.headerTitle}>
                    <div className={styles.statusDot}></div>
                    <span>VFX_AI_CORE v1.0</span>
                </div>
                <div className={styles.controls}>
                    <button onClick={toggleMinimize} className={styles.controlBtn}>
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={toggleChat} className={styles.controlBtn}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className={styles.messages}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                                <div className={styles.messageContent}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter command..."
                            className={styles.input}
                        />
                        <button type="submit" className={styles.sendBtn}>
                            <Send size={18} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
