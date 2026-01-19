import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Success Stories', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navigation */}
      <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <a href="#home" className="flex items-center gap-2 group">
                <div className={`p-2 rounded-full transition-colors ${scrolled ? 'bg-rose-50 text-rose-600' : 'bg-white/10 text-rose-600 md:text-white'}`}>
                   <Heart className={`h-5 w-5 fill-current ${scrolled ? 'text-rose-600' : 'text-rose-600 md:text-white group-hover:text-rose-500'}`} />
                </div>
                <span className={`font-serif text-2xl font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-900 md:text-white'}`}>
                  Duoplee
                </span>
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-rose-500 ${
                    scrolled ? 'text-slate-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#services" 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                  scrolled 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-white text-rose-900 hover:bg-rose-50'
                }`}
              >
                Find a Match
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none transition-colors ${scrolled || isMenuOpen ? 'text-slate-900' : 'text-white'}`}
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white absolute w-full shadow-xl border-b border-gray-100 animate-in slide-in-from-top-5 duration-200">
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium transition-colors text-slate-600 hover:text-slate-900"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 bg-rose-600 text-white rounded-lg font-semibold shadow-md active:scale-95 transition-transform"
              >
                Start Search
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-rose-600 rounded-lg">
                  <Heart className="h-5 w-5 text-white fill-current" />
                </div>
                <span className="font-serif text-xl font-bold tracking-wide">Duoplee</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Premium investigative matchmaking for the modern era. We bridge the gap between digital obscurity and real-world connection with discretion and precision.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={18} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={18} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={18} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-6">Services</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#services" className="hover:text-rose-400 transition-colors">Social Discovery</a></li>
                <li><a href="#services" className="hover:text-rose-400 transition-colors">Partner Search</a></li>
                <li><a href="#services" className="hover:text-rose-400 transition-colors">Soulmate Protocol</a></li>
                <li><a href="#services" className="hover:text-rose-400 transition-colors">Priority Delivery</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-6">Company</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#about" className="hover:text-rose-400 transition-colors">About Us</a></li>
                <li><a href="#about" className="hover:text-rose-400 transition-colors">Success Stories</a></li>
                <li><a href="#contact" className="hover:text-rose-400 transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-rose-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-6">Legal</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-rose-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Duoplee. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-600 max-w-xl text-justify md:text-right">
              Disclaimer: Duoplee is a research and discovery service. Match fulfillment is contingent upon public data availability and individual circumstances. Payment covers the investigative process and does not guarantee a specific relationship outcome. Express services expedite the search process.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;