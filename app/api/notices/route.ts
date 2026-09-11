// app/api/notices/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseSecretKey =
  process.env.WAGGLE_SUPABASE_SECRET_KEY || '';

const adminPassword =
  process.env.NOTICE_ADMIN_PASSWORD || '';

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Notice Supabase server environment variables are missing.'
    );
  }

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
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

    const password =
      String(body?.password || '');

    if (!adminPassword) {
      throw new Error(
        'NOTICE_ADMIN_PASSWORD is missing.'
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Unauthorized.',
        },
        { status: 401 }
      );
    }

    if (action === 'auth') {
      return NextResponse.json({
        ok: true,
      });
    }

    const supabase =
      getSupabaseAdmin();

    if (action === 'create') {
      const title =
        String(body?.title || '').trim();

      const content =
        String(body?.content || '').trim();

      if (!title || !content) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Title and content are required.',
          },
          { status: 400 }
        );
      }

      const { error } =
        await supabase
          .from('notices')
          .insert([
            {
              title,
              content,
            },
          ]);

      if (error) {
        console.error(
          '[notices create error]',
          error
        );

        return NextResponse.json(
          {
            ok: false,
            error: 'Failed to create notice.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
      });
    }

    if (action === 'update') {
      const id =
        Number(body?.id);

      const title =
        String(body?.title || '').trim();

      const content =
        String(body?.content || '').trim();

      if (
        !Number.isFinite(id) ||
        !title ||
        !content
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Invalid notice data.',
          },
          { status: 400 }
        );
      }

      const { error } =
        await supabase
          .from('notices')
          .update({
            title,
            content,
          })
          .eq('id', id);

      if (error) {
        console.error(
          '[notices update error]',
          error
        );

        return NextResponse.json(
          {
            ok: false,
            error: 'Failed to update notice.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
      });
    }

    if (action === 'delete') {
      const id =
        Number(body?.id);

      if (!Number.isFinite(id)) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Invalid notice id.',
          },
          { status: 400 }
        );
      }

      const { error } =
        await supabase
          .from('notices')
          .delete()
          .eq('id', id);

      if (error) {
        console.error(
          '[notices delete error]',
          error
        );

        return NextResponse.json(
          {
            ok: false,
            error: 'Failed to delete notice.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Unsupported action.',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      '[notices route exception]',
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