import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileBottomDock } from './MobileBottomDock'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bright pb-24 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileBottomDock />
    </div>
  )
}
