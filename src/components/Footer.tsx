import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { Mail, Phone, ArrowUpRight } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-primary/5 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Column */}
          <div className="space-y-8">
            <Logo />
            <p className="text-primary-dark/40 font-dm-sans leading-relaxed italic max-w-xs">
              Empowering students to find safe, verified, and affordable housing in Mutare and beyond. Your academic journey starts with a perfect home.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="font-manrope font-black text-primary-dark uppercase tracking-widest text-xs">For Students</h4>
            <ul className="space-y-4">
              {['Explore Housing', 'Verified Hostels', 'Safety Guide', 'Help Center'].map((item) => (
                <li key={item}>
                  <Link to="/explorer" className="text-primary-dark/50 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Links */}
          <div className="space-y-8">
            <h4 className="font-manrope font-black text-primary-dark uppercase tracking-widest text-xs">Partnerships</h4>
            <ul className="space-y-4">
              {[
                { name: 'List Property', path: '/auth?role=landlord' },
                { name: 'Join as Provider', path: '/auth?role=provider' },
                { name: 'Corporate Housing', path: '/auth?role=landlord' },
                { name: 'Landlord Portal', path: '/auth?role=landlord' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-primary-dark/50 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1 group">
                    {item.name} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="font-manrope font-black text-primary-dark uppercase tracking-widest text-xs">Get in Touch</h4>
            <div className="space-y-6">
               <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary-dark/40 group-hover:text-primary transition-colors">
                     <Mail size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest mb-1">Email Support</p>
                     <p className="text-sm font-bold text-primary-dark">hello@muzinda.co.zw</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary-dark/40 group-hover:text-primary transition-colors">
                     <Phone size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-primary-dark/20 uppercase tracking-widest mb-1">WhatsApp Us</p>
                     <p className="text-sm font-bold text-primary-dark">+263 770 000 000</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-bold text-primary-dark/30 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Muzinda Hub. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[11px] font-black text-primary-dark/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] font-black text-primary-dark/30 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
