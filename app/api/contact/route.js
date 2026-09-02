import { NextResponse } from 'next/server';
import { contact } from '@/lib/content';

// Contact form delivery.
// Option A (recommended): set WEB3FORMS_ACCESS_KEY in Vercel → https://web3forms.com (free)
// Option B (zero setup): FormSubmit — the FIRST message triggers a one-time
//   activation email to the inbox below; click "Activate" once and it works forever.
// If CONTACT_FORM_PROVIDER=none, the API answers 503 and the site falls back to mailto:.

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || contact.email;

export async function POST(request) {
    try {
        const { name, email, message, website } = await request.json();

        // honeypot — bots fill hidden fields
        if (website) return NextResponse.json({ message: 'ok' }, { status: 200 });

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }
        if (message.length > 5000) {
            return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
        }

        const provider = process.env.CONTACT_FORM_PROVIDER
            || (process.env.WEB3FORMS_ACCESS_KEY ? 'web3forms' : 'formsubmit');

        if (provider === 'none') {
            return NextResponse.json({ error: 'Contact form not configured' }, { status: 503 });
        }

        let ok = false;

        if (provider === 'web3forms') {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: process.env.WEB3FORMS_ACCESS_KEY,
                    subject: `Portfolio enquiry from ${name}`,
                    from_name: name,
                    email,
                    message,
                }),
            });
            const data = await res.json().catch(() => ({}));
            ok = !!data.success;
        } else {
            const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _subject: `Portfolio enquiry from ${name}`,
                    _replyto: email,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });
            const data = await res.json().catch(() => ({}));
            ok = res.ok && (data.success === 'true' || data.success === true);
        }

        if (!ok) throw new Error('Delivery failed');

        return NextResponse.json({ message: 'Message sent successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Failed to send message. Please email directly.' }, { status: 500 });
    }
}
