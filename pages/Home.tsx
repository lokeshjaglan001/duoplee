import React from 'react';
import { ArrowRight, Search, ShieldCheck, Microscope, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div id="home" className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Professional Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2560&auto=format&fit=crop" 
            alt="Connection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 max-w-5xl mx-auto text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-rose-100 text-xs font-semibold tracking-widest uppercase">Premium Matchmaking</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            Destiny is not found. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-rose-200">It is Discovered.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            We specialize in high-precision social discovery and partner verification. 
            Whether you are searching for a missed connection or your life partner, we bridge the gap.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="#services" 
              className="group px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-medium rounded-full shadow-lg shadow-rose-900/20 transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1"
            >
              View Pricing Plans <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/20 text-lg font-medium rounded-full transition-all duration-300 hover:border-white/40"
            >
              How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex justify-center gap-8 text-white/60 text-sm font-medium flex-wrap">
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-rose-400" /> 100% Confidential</div>
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-rose-400" /> Human Verified</div>
             <div className="flex items-center gap-2"><CheckCircle size={16} className="text-rose-400" /> Secure Data</div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-rose-600 tracking-widest uppercase mb-3">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">Why the world trusts Duoplee</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Search className="text-rose-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Precision Identification</h4>
              <p className="text-slate-600 leading-relaxed">
                Our team utilizes advanced OSINT (Open Source Intelligence) techniques combined with intuitive analysis to locate profiles based on minimal data points.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Microscope size={120} />
               </div>
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <Microscope className="text-rose-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Deep Dive Verification</h4>
              <p className="text-slate-600 leading-relaxed relative z-10">
                We don't rush perfection. Our 7-day standard process ensures every potential match is cross-referenced, verified, and vetted for authenticity.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="text-rose-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">Absolute Discretion</h4>
              <p className="text-slate-600 leading-relaxed">
                Your privacy is paramount. All reports are delivered through secure, encrypted channels. We never contact the subject of the search.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Break / Emotional Hook */}
      <div className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2560&auto=format&fit=crop" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white font-medium mb-8 leading-tight">
              "The universe is full of magical things patiently waiting for our wits to grow sharper."
            </h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto mb-8"></div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
              Stop leaving your happiness to chance. Take control of your narrative with Duoplee.
            </p>
            <a href="#services" className="inline-block border border-white/30 hover:bg-white hover:text-slate-900 text-white px-10 py-4 rounded-full transition-all duration-300 font-medium">
              Find Your Match
            </a>
        </div>
      </div>
    </div>
  );
};

export default Home;