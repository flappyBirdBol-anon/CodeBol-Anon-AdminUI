"use client";

import '@/app/globals.css'
import '@/app/components/dark-theme-override.css'
import { Inter } from 'next/font/google'
import './courses/[id]/courseDetail.css'
import { AuthProvider } from './components/AuthContext';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) 
{
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  )
}