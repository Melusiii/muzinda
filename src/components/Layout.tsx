import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileBottomDock } from './MobileBottomDock'
import { cn } from '../utils/cn'

interface LayoutProps {
  children?: ReactNode
  isAuthenticated?: boolean
  showFooter?: boolean
}

export const Layout = ({ children, isAuthenticated, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-surface-bright overflow-x-hidden">
      <Navbar />
      <main className={cn(isAuthenticated && "md:pl-64")}>
        <Outlet />
        {children}
      </main>
      {showFooter && <Footer />}
      <MobileBottomDock />
    </div>
  )
}
