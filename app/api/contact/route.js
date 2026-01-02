import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();

    // Here we would normally send an email or save to DB
    console.log('Contact form submission:', body);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: 'Message sent successfully' });
}
