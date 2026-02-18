import { motion } from 'framer-motion';
import { Car, Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10">
              {/* BMW Logo SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"/>
                <path d="M50 2 A48 48 0 0 1 98 50 L50 50 Z" fill="#0066b1"/>
                <path d="M2 50 A48 48 0 0 1 50 2 L50 50 Z" fill="#fff"/>
                <path d="M50 50 L98 50 A48 48 0 0 1 50 98 Z" fill="#fff"/>
                <path d="M50 50 L50 98 A48 48 0 0 1 2 50 Z" fill="#0066b1"/>
                <circle cx="50" cy="50" r="28" fill="#000"/>
                <text x="50" y="55" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">i</text>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">BMW Şarj Asistanı</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Elektrikli Araç Hesaplayıcı</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-6"
          >
            <NavLink icon={<Car className="w-4 h-4" />} label="Modeller" />
            <NavLink icon={<Zap className="w-4 h-4" />} label="Hesaplayıcı" active />
          </motion.nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-slate-900/95 border-b border-slate-800/50"
      >
        <div className="px-4 py-4 space-y-2">
          <MobileNavLink icon={<Car className="w-4 h-4" />} label="Modeller" />
          <MobileNavLink icon={<Zap className="w-4 h-4" />} label="Hesaplayıcı" active />
        </div>
      </motion.div>
    </header>
  );
}

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavLink({ icon, label, active }: NavLinkProps) {
  return (
    <button
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        active 
          ? 'text-blue-400' 
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavLink({ icon, label, active }: NavLinkProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-500/10 text-blue-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
