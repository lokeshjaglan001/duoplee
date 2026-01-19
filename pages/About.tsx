import React from 'react';
import { Users, Heart, Award, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div id="about" className="flex flex-col">
      {/* Header Section */}
      <div className="bg-slate-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-rose-900/40 to-transparent"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Bridging Hearts & Data</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            We are the intersection of romantic intuition and digital intelligence.
            </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-10 z-20 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="text-center pt-4 md:pt-0">
              <div className="text-4xl font-bold text-slate-900 mb-1">70k+</div>
              <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Couples Matched</div>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-4xl font-bold text-slate-900 mb-1">98%</div>
              <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Satisfaction</div>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-4xl font-bold text-slate-900 mb-1">12</div>
              <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Countries</div>
            </div>
            <div className="text-center pt-8 md:pt-0">
              <div className="text-4xl font-bold text-slate-900 mb-1">24h</div>
              <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Fastest Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="w-full lg:w-1/2">
               <div className="relative">
                 <div className="absolute -inset-4 bg-gradient-to-r from-rose-100 to-slate-100 rounded-2xl transform -rotate-2"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                   alt="Team working" 
                   className="relative rounded-xl shadow-lg w-full object-cover h-[500px]" 
                 />
                 <div className="absolute bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                    <p className="font-serif italic text-slate-700">"We don't just find profiles; we find stories waiting to happen."</p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">JP</div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Head of Research</span>
                    </div>
                 </div>
               </div>
             </div>
             
             <div className="w-full lg:w-1/2">
               <h2 className="text-rose-600 font-bold tracking-widest uppercase text-sm mb-3">Our Philosophy</h2>
               <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Connecting the Unconnected</h3>
               
               <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                 <p>
                   Duoplee was born from a simple observation: in a world of billions, serendipity often needs a helping hand. 
                 </p>
                 <p>
                   Many of our clients recall a fleeting glance, a brief conversation, or a friend-of-a-friend they can't stop thinking about. Traditional social media makes finding these specific individuals difficult without a name.
                 </p>
                 <p>
                   That is where we come in. Our dedicated team of OSINT specialists and intuitive matchmakers work with respect and discretion to verify identities and facilitate connections that might otherwise never occur.
                 </p>
               </div>

               <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Globe size={20} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900">Global Reach</h4>
                        <p className="text-sm text-slate-500">Operating across major social platforms.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Award size={20} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900">Premium Quality</h4>
                        <p className="text-sm text-slate-500">Verified data, detailed reports.</p>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;