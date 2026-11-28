'use client';

import { createClient } from '@supabase/supabase-js';

export function createXdicAdminClient() {
  if (typeof window === 'undefined') {
    throw new Error('ADMIN_BROWSER_ONLY');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('ADMIN_CONFIG_MISSING');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'xdic-admin-' + window.crypto.randomUUID(),
    },
  });
}

export type XdicAdminClient =
  ReturnType<typeof createXdicAdminClient>;

export async function verifyXdicAdmin(
  client: XdicAdminClient
): Promise<boolean> {
  try {
    const { data: identity, error: identityError } =
      await client.auth.getUser();

    if (identityError || !identity.user) {
      return false;
    }

    const { data, error } =
      await client.rpc('xdic_is_admin');

    return !error && data === true;
  } catch {
    return false;
  }
}

export async function signOutXdicAdmin(
  client: XdicAdminClient
): Promise<boolean> {
  try {
    const { error } = await client.auth.signOut({
      scope: 'local',
    });

    return !error;
  } catch {
    return false;
  }
}

export async function signInXdicAdmin(
  email: string,
  password: string
): Promise<XdicAdminClient | null> {
  let client: XdicAdminClient | null = null;
  let approved = false;

  try {
    if (!email.trim() || !password) {
      return null;
    }

    client = createXdicAdminClient();

    const { data, error } =
      await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error || !data.user || !data.session) {
      return null;
    }

    approved = await verifyXdicAdmin(client);

    return approved ? client : null;
  } catch {
    return null;
  } finally {
    if (client && !approved) {
      await signOutXdicAdmin(client);
    }
  }
}