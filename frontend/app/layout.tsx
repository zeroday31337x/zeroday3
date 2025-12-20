import type { Metadata } from 'next';
import './globals.css';

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ZeroDay3 Matching AI';
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 
  'Matching Companies to AI Workflows and People to Products through Technical Truth';

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
