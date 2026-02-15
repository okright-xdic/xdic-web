'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white font-serif">D</div>
          <span className="text-xl font-bold tracking-tighter">XDIC <span className="text-blue-600">WEB</span></span>
        </Link>
        <nav className="text-sm font-medium text-slate-500 gap-4 flex">
          <Link href="/" className="hover:text-blue-600">홈</Link>
          <span className="text-slate-200">|</span>
          <span className="cursor-default">사전검색</span>
        </nav>
      </div>
    </header>
  );
}