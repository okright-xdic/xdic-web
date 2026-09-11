// app/api/waggle/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const waggleSecretKey =
  process.env.WAGGLE_SUPABASE_SECRET_KEY || '';

function getSupabaseAdmin() {
  if (!supabaseUrl || !waggleSecretKey) {
    throw new Error(
      'Waggle Supabase server environment variables are missing.'
    );
  }

  return createClient(
    supabaseUrl,
    waggleSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const action =
      String(body?.action || '').trim();

    if (action !== 'list') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Waggle is read-only.',
        },
        { status: 403 }
      );
    }

    const supabase =
      getSupabaseAdmin();

    const { data, error } =
      await supabase
        .from('tester_feedback')
        .select(
          'id, nickname, content, is_secret, reply, created_at, is_notice'
        )
        .order(
          'created_at',
          { ascending: false }
        );

    if (error) {
      console.error(
        '[waggle list error]',
        error
      );

      return NextResponse.json(
        {
          ok: false,
          error: 'Failed to load feedback.',
        },
        { status: 500 }
      );
    }

    const safeFeedbacks =
      (data || []).map((fb) => {
        const isNotice =
          Boolean(fb.is_notice);

        const canViewContent =
          isNotice ||
          !fb.is_secret;

        return {
          id: fb.id,
          nickname: fb.nickname,
          content: canViewContent
            ? fb.content
            : null,
          is_secret:
            Boolean(fb.is_secret),
          reply: canViewContent
            ? fb.reply
            : null,
          created_at:
            fb.created_at,
          is_notice:
            isNotice,
          can_view_content:
            canViewContent,
        };
      });

    const notices =
      safeFeedbacks.filter(
        (fb) => fb.is_notice
      );

    const normalFeedbacks =
      safeFeedbacks.filter(
        (fb) => !fb.is_notice
      );

    return NextResponse.json(
      {
        ok: true,
        feedbacks: [
          ...notices,
          ...normalFeedbacks,
        ],
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error(
      '[waggle route exception]',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: 'Server error.',
      },
      { status: 500 }
    );
  }
}