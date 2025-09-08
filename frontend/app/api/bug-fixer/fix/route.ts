/**
 * API Routes for AI Bug Fixing Service
 */

import { NextRequest, NextResponse } from 'next/server';
import { BugFixer, BugFixRequest } from '@/lib/bug-fixer/BugFixer';

const bugFixer = new BugFixer();

/**
 * POST /api/bug-fixer/fix
 * Main endpoint for fixing code bugs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.code || !body.language) {
      return NextResponse.json(
        { error: 'Missing required fields: code and language' },
        { status: 400 }
      );
    }

    // Check if language is supported
    if (!bugFixer.isLanguageSupported(body.language)) {
      return NextResponse.json(
        { 
          error: `Language '${body.language}' is not supported`,
          supportedLanguages: bugFixer.getSupportedLanguages()
        },
        { status: 400 }
      );
    }

    const bugFixRequest: BugFixRequest = {
      code: body.code,
      language: body.language,
      error: body.error,
      context: body.context,
      preferences: body.preferences || {
        style: 'conservative',
        includeComments: true,
        includeTests: false
      }
    };

    const result = await bugFixer.fixCode(bugFixRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Bug fixer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bug-fixer/languages
 * Get list of supported programming languages
 */
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
