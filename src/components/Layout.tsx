import type { ReactNode } from 'react'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bright pb-24 md:pb-0">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
