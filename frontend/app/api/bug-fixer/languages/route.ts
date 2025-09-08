/**
 * GET /api/bug-fixer/languages
 * Get list of supported programming languages
 */

import { NextResponse } from 'next/server';
import { BugFixer } from '@/lib/bug-fixer/BugFixer';

const bugFixer = new BugFixer();

export async function GET() {
  try {
    const languages = bugFixer.getSupportedLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supported languages' },
      { status: 500 }
    );
  }
}
