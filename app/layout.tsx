import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import AnimatedLayout from '@/components/animated-layout'

export const metadata: Metadata = {
  title: 'HealthAI — AI-Powered Healthcare Platform',
  description: 'Comprehensive AI healthcare intelligence — symptom checker, disease detection, telemedicine, health risk prediction, and more. Powered by Google Gemini 2.0.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AnimatedLayout>{children}</AnimatedLayout>
        <Analytics />
      </body>
    </html>
  )
}
