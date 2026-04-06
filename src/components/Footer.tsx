import { Logo } from './Logo'

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center gap-6 bg-white border-t border-primary/10">
      <Logo />
      <div className="flex flex-wrap justify-center gap-8">
        <a href="mailto:support@muzinda.app" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">Contact Support</a>
        <a href="https://wa.me/263770000000" target="_blank" rel="noopener noreferrer" className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium">WhatsApp Help</a>
        <button onClick={() => alert('Legal terms coming soon')} className="text-primary-dark/70 hover:text-primary transition-colors text-sm font-medium outline-none">Terms</button>
      </div>
      <p className="text-primary-dark/50 text-xs mt-4">
        © {new Date().getFullYear()} Muzinda Student Concierge. Built for Mutare.
      </p>
    </footer>
  )
}
