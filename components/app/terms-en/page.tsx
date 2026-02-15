// app/terms-en/page.tsx
"use client";

export default function TermsEnPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms of Use & Privacy Policy (English)</h1>
      <iframe
        src="/docs/이용약관_및_개인정보처리방침_영어.pdf"
        className="w-full h-[80vh] border"
      ></iframe>
    </main>
  );
}
