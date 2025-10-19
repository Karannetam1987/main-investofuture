import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { file, data } = await req.json();

    if (!file || !data) {
      return NextResponse.json({ message: 'Missing file name or data' }, { status: 400 });
    }

    // Basic security check to prevent path traversal
    if (file.includes('..') || !file.endsWith('.json')) {
        return NextResponse.json({ message: 'Invalid file path' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', file);
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: `${file} updated successfully` }, { status: 200 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
