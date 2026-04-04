import { Logo } from './Logo'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center gap-6 bg-white border-t border-primary/10">
      <Logo />
      <div className="flex flex-wrap justify-center gap-8">
        <Link to="/support" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">Support</Link>
        <Link to="/privacy" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link>
        <Link to="/support" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">Support Center</Link>
        <Link to="/partner" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">Partner with Us</Link>
      </div>
      <p className="text-primary-dark/50 text-xs mt-4">
        © {new Date().getFullYear()} Muzinda Student Concierge. Built for Mutare.
      </p>
    </footer>
  )
}
