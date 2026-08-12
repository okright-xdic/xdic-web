'use client';

import Image from 'next/image';

const PLAY_STORE_SEARCH_URL =
  'https://play.google.com/store/search?q=x-dic&c=apps';

const APP_STORE_SEARCH_URL =
  'https://apps.apple.com/kr/search?term=x-dic';

export default function AppPromoBanner() {
  return (
    <section
      aria-labelledby="xdic-app-promo-title"
      className="w-full"
    >
      <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/85 via-white to-indigo-50/70 shadow-sm">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-100/45 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-violet-100/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-5">
          <div className="flex items-start gap-3 md:gap-4 min-w-0">
            <div className="shrink-0 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <Image
                src="/images/LOGO_01_ChatGPT_S.jpg"
                alt="X-DIC 모바일 앱"
                width={64}
                height={64}
                className="h-full w-full object-contain p-1.5"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.12em] text-sky-500">
                X-DIC Mobile App
              </p>

              <h2
                id="xdic-app-promo-title"
                className="mt-0.5 text-[16px] md:text-[20px] font-black text-slate-900 tracking-tight"
              >
                휴대폰에서도 무료 X-DIC을 이용하세요
              </h2>

              <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                실용 번역·전문용어·영어 표현을 휴대폰에서도 빠르게 찾아보세요.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] md:text-[11px] font-bold">
                <span className="rounded-full border border-violet-100 bg-white/90 px-2 py-1 text-violet-600">
                  검색어: x-dic
                </span>
                <span className="rounded-full border border-sky-100 bg-white/90 px-2 py-1 text-sky-600">
                  Galaxy · Google Play
                </span>
                <span className="rounded-full border border-sky-100 bg-white/90 px-2 py-1 text-sky-600">
                  iPhone · App Store
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 grid grid-cols-2 md:flex md:flex-col gap-2">
            <a
              href={PLAY_STORE_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-2 text-[11px] md:text-[12px] font-extrabold text-slate-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/60 transition-colors"
              aria-label="Google Play에서 x-dic 검색"
            >
              <span aria-hidden="true">▶</span>
              Google Play
            </a>

            <a
              href={APP_STORE_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-2 text-[11px] md:text-[12px] font-extrabold text-white shadow-sm hover:bg-slate-800 transition-colors"
              aria-label="App Store에서 x-dic 검색"
            >
              <span aria-hidden="true">●</span>
              App Store
            </a>
          </div>
        </div>

        <div className="relative border-t border-sky-100/80 bg-white/55 px-4 md:px-5 py-2.5">
          <p className="text-[10px] md:text-[11px] text-slate-500 text-center md:text-left break-keep">
            앱 스토어에서 <strong className="font-extrabold text-violet-600">x-dic</strong>을 검색하세요.
            웹과 앱에서 X-DIC 검색을 이어서 이용할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
