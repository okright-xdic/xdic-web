// app/terms-en/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Terms of Use & Privacy Policy (English)',
  description:
    'Read the English version of the X-DIC Terms of Use and Privacy Policy.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsEnLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}