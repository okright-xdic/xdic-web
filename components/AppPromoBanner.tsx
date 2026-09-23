'use client';

import Image from 'next/image';

const PLAY_STORE_SEARCH_URL =
  'https://play.google.com/store/search?q=%EC%97%91%EC%8A%A4%EB%94%95&c=apps';

export default function AppPromoBanner() {
  return (
    <section
      aria-labelledby="xdic-app-promo-title"
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-indigo-100 via-violet-100 to-sky-100 shadow-[0_12px_30px_rgba(99,102,241,0.14)] ring-1 ring-white/80">
        <div
          className="pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-fuchsia-300/45 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-sky-300/50 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute right-5 top-5 h-20 w-20 rounded-full border border-white/50 bg-white/20"
          aria-hidden="true"
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-4 min-w-0">
            <div className="shrink-0 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl border-2 border-white bg-white shadow-[0_6px_16px_rgba(79,70,229,0.18)] overflow-hidden">
              <Image
                src="/images/LOGO_01_ChatGPT_S.jpg"
                alt="X-DIC 모바일 앱"
                width={64}
                height={64}
                className="h-full w-full object-contain p-1.5"
              />
            </div>

            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-violet-200 bg-white/75 px-2.5 py-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] text-violet-700 shadow-sm">
                X-DIC Mobile App
              </p>

              <h2
                id="xdic-app-promo-title"
                className="mt-2 text-[17px] md:text-[21px] font-black text-slate-950 tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]"
              >
                휴대폰에서도 X-DIC 앱을 이용하세요
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] md:text-[11px] font-bold">
                <span className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-violet-700 shadow-sm">
                  검색어: 엑스딕
                </span>
                <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-emerald-700 shadow-sm">
                  Galaxy · Google Play
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex">
            <a
              href={PLAY_STORE_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-600 px-4.5 py-2.5 text-[11px] md:text-[12px] font-black text-white shadow-[0_7px_18px_rgba(5,150,105,0.24)] hover:border-emerald-500 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Google Play에서 엑스딕 검색"
            >
              <span aria-hidden="true">▶</span>
              Google Play
            </a>
          </div>
        </div>

        <div className="relative border-t border-violet-200 bg-white/72 px-4 md:px-5 py-2.5 backdrop-blur-[1px]">
          <p className="text-[10px] md:text-[11px] font-semibold text-slate-700 text-center md:text-left break-keep">
            스토어에서 <strong className="font-extrabold text-violet-700">'엑스딕'</strong>을 검색하세요.
          </p>
        </div>
      </div>
    </section>
  );
}
