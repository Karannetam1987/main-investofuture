
import {NextRequest, NextResponse} from 'next/server';
import {sendEmail} from '@/ai/flows/send-email-flow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, from, subject, message } = body;

    if (!name || !from || !subject || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendEmail({ name, from, subject, message });

    if (result.success) {
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
