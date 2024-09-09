import { ReactNode } from 'react'
import NextThemeProvider from '@/NextThemeProvider'
import Header from '@/sections/Header'

import './globals.css'
// eslint-disable-next-line camelcase
import { IBM_Plex_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const helveticaDisplay = localFont({
  src: [
    {
      path: '../assets/fonts/HelveticaNowDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/HelveticaNowDisplay-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-helveticaDisplay',
})

const helveticaMicro = localFont({
  src: [
    {
      path: '../assets/fonts/HelveticaNowMicro-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../assets/fonts/HelveticaNowMicro-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/HelveticaNowMicro-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-helveticaMicro',
})

const ibm = IBM_Plex_Mono({
  variable: '--font-ibm-mono',
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ibm.variable} ${helveticaDisplay.variable} ${helveticaMicro.variable}`}
    >
      <body className="lg:pl-117px lg:pr-33px pl-[10px] pr-[10px] bg-background-light dark:bg-background-dark">
        <NextThemeProvider>
          <Header />
          <div className="flex content-center justify-center items-center">
            {children}
          </div>
        </NextThemeProvider>
      </body>
    </html>
  )
}
