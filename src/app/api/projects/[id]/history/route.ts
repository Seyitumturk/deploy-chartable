'use server'

import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';

// This is the correct type for Next.js App Router route handlers
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project ID from URL using searchParams
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const projectId = segments[segments.indexOf('projects') + 1];

    const { prompt, diagram, updateType } = await req.json();

    await connectDB();
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await Project.findOne({
      _id: projectId,
      userId: user._id,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Add new history item
    project.history.unshift({
      prompt,
      diagram,
      updateType,
      updatedAt: new Date(),
    });

    await project.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 