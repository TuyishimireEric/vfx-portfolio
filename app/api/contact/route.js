import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, email, message } = await request.json();

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Using Web3Forms API (free email service)
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_KEY',
                subject: `New Portfolio Contact from ${name}`,
                from_name: name,
                email: email,
                message: message,
                to: 'julesrukundo12@gmail.com'
            })
        });

        const data = await response.json();

        if (data.success) {
            return NextResponse.json(
                { message: 'Message sent successfully!' },
                { status: 200 }
            );
        } else {
            throw new Error(data.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
