import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import GptResponse from '@/models/GptResponse';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get diagram ID from URL
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const diagramId = segments[segments.indexOf('diagrams') + 1];

    const diagram = await GptResponse.findById(diagramId);
    if (!diagram) {
      return NextResponse.json({ error: 'Diagram not found' }, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error('Error fetching diagram:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 