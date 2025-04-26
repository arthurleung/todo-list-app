import './globals.css';
import { Inter } from 'next/font/google';
import FirebaseProvider from './components/FirebaseProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Todo List App',
  description: 'A simple todo list application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
