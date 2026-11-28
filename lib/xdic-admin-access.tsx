'use client';

import React, { useEffect, useRef, useState } from 'react';
import { signInXdicAdmin, signOutXdicAdmin, verifyXdicAdmin } from './xdic-admin-auth';
import type { XdicAdminClient } from './xdic-admin-auth';

export function useXdicAdminAccess() {
  const current = useRef<XdicAdminClient | null>(null);
  const mounted = useRef(true);
  const pending = useRef(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const client = current.current;
      current.current = null;
      if (client) void signOutXdicAdmin(client);
    };
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    if (pending.current || current.current || !mounted.current) return false;
    pending.current = true;
    setBusy(true);
    try {
      const client = await signInXdicAdmin(email, password);
      if (!client) return false;
      if (!mounted.current) {
        await signOutXdicAdmin(client);
        return false;
      }
      current.current = client;
      setIsAdmin(true);
      setOpen(false);
      return true;
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function logout(): Promise<boolean> {
    const client = current.current;
    current.current = null;
    if (mounted.current) {
      setIsAdmin(false);
      setOpen(false);
    }
    return client ? signOutXdicAdmin(client) : true;
  }

  async function requireAdmin(): Promise<XdicAdminClient | null> {
    const client = current.current;
    if (!client || !mounted.current) return null;
    const approved = await verifyXdicAdmin(client);
    if (!mounted.current || current.current !== client) return null;
    if (!approved) {
      await logout();
      return null;
    }
    return client;
  }

  return {
    isAdmin, open, busy, login, logout, requireAdmin,
    openLogin: () => { if (!pending.current) setOpen(true); },
    closeLogin: () => { if (!pending.current) setOpen(false); },
  };
}

export function XdicAdminLoginForm({ access, cancellable = true }: {
  access: ReturnType<typeof useXdicAdminAccess>;
  cancellable?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (access.busy) return;
    setFailed(false);
    const value = password;
    setPassword('');
    const ok = await access.login(email, value);
    if (!ok && mounted.current) setFailed(true);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-left">
      <label className="block text-sm font-medium text-slate-700">
        관리자 이메일
        <input type="email" required autoComplete="username" value={email}
          onChange={e => setEmail(e.target.value)} disabled={access.busy}
          className="mt-1 w-full rounded border border-slate-300 p-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        비밀번호
        <input type="password" required autoComplete="current-password" value={password}
          onChange={e => setPassword(e.target.value)} disabled={access.busy}
          className="mt-1 w-full rounded border border-slate-300 p-2" />
      </label>
      {failed && <p role="alert" className="text-sm text-red-600">관리자 인증에 실패했습니다. 계정 또는 연결 상태를 확인해주세요.</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={access.busy || !email.trim() || !password}
          className="flex-1 rounded bg-slate-800 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">
          {access.busy ? '인증 중...' : '관리자 로그인'}
        </button>
        {cancellable && <button type="button" disabled={access.busy} onClick={access.closeLogin}
          className="rounded border border-slate-300 px-3 py-2 text-sm">취소</button>}
      </div>
    </form>
  );
}
