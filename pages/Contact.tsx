import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertTriangle, Shield, Clock, HeartHandshake } from 'lucide-react';

interface ContactProps {
  prefillData: {
    plan?: string;
    price?: number;
    mode?: string;
    genderPreference?: string;
    payerName?: string;
    payerEmail?: string;
    generatedMatches?: { 
      handle: string; 
      niche: string;
      age?: number;
      location?: string;
      occupation?: string;
    }[];
  } | null;
}

const Contact: React.FC<ContactProps> = ({ prefillData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
    consent: false
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefillData) {
      setSubmitted(false);
      setFormData(prev => ({
        ...prev,
        name: prefillData.payerName || prev.name,
        email: prefillData.payerEmail || prev.email
      }));
    }
  }, [prefillData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const matchString = prefillData?.generatedMatches 
      ? prefillData.generatedMatches.map((m, i) => 
          `${i + 1}. Handle: ${m.handle}\n   Category: ${m.niche}\n   Age: ${m.age || 'N/A'}\n   Location: ${m.location || 'N/A'}\n   Job: ${m.occupation || 'N/A'}`
        ).join('\n\n')
      : 'No matches generated automatically.';

    const subject = `New Inquiry: ${prefillData?.plan || 'General Service'} - ${formData.name}`;
    const body = `
New Service Request from Duoplee Website

CLIENT DETAILS
--------------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

ORDER DETAILS
--------------------------------
Plan: ${prefillData?.plan || 'Not selected'}
Price: ${prefillData?.price ? '₹' + prefillData.price : 'N/A'}
Delivery: Standard (7 Days)
Gender Preference: ${prefillData?.genderPreference || 'N/A'}

SYSTEM GENERATED MATCHES
(Admin: Send these details to the client)
--------------------------------
${matchString}

ADDITIONAL DETAILS
--------------------------------
${formData.details}

CONSENT
--------------------------------
User accepted policies: Yes
    `.trim();

    window.location.href = `mailto:lokeshjaglan01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (submitted) {
    return (
        <div id="contact" className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="max-w-xl w-full text-center space-y-8 animate-fade-in-up relative z-10">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 text-green-500 border border-green-50">
                    <CheckCircle className="w-12 h-12" />
                </div>
                
                <h2 className="text-4xl font-serif font-bold text-slate-900">Inquiry Sent</h2>
                
                <div className="bg-white/80 backdrop-blur-md border border-white/50 p-8 rounded-3xl text-left shadow-xl shadow-slate-200/50">
                  <h4 className="font-bold text-slate-900 flex items-center gap-3 mb-4 text-lg">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Clock size={20} /></div>
                    Next Steps
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Thank you, <strong>{formData.name}</strong>. Your request has been securely logged.
                    Our team is now verifying the {prefillData?.generatedMatches?.length || 5} profile matches allocated to your case.
                  </p>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl">
                     <Mail size={16} className="text-slate-400"/>
                     <span>Report delivery to: <strong>{formData.email}</strong></span>
                  </div>
                </div>

                <div className="flex justify-center">
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      Return Home
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div id="contact" className="bg-white py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
          {/* Sidebar / Info */}
          <div className="w-full lg:w-5/12 space-y-10">
            <div>
                <h2 className="text-rose-600 font-bold tracking-widest uppercase text-sm mb-4">Get in Touch</h2>
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">We are here to help you find clarity.</h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Have questions about our process? Need a custom consultation? 
                    Our discreet team is ready to assist you.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600"><Mail size={24} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Email Support</h4>
                        <p className="text-slate-500 text-sm">concierge@duoplee.com</p>
                        <p className="text-slate-400 text-xs mt-1">24/7 Response Time</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600"><Shield size={24} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Privacy Guarantee</h4>
                        <p className="text-slate-500 text-sm">All communications are end-to-end encrypted and strictly confidential.</p>
                    </div>
                </div>
            </div>

            {prefillData && (
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-600/30 transition-colors duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><HeartHandshake size={20} className="text-rose-400" /></div>
                            <h3 className="font-serif text-xl font-bold">Order Summary</h3>
                        </div>
                        
                        <div className="space-y-4 text-sm text-slate-300">
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <span>Selected Plan</span>
                                <span className="font-bold text-white text-base">{prefillData.plan}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <span>Preference</span>
                                <span className="font-bold text-white capitalize flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${prefillData.genderPreference === 'female' ? 'bg-rose-400' : 'bg-blue-400'}`}></span>
                                    {prefillData.genderPreference}
                                </span>
                            </div>
                            <div className="pt-2 flex justify-between items-end">
                                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Paid</span>
                                <span className="font-serif text-3xl font-bold text-white">₹{prefillData.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Main Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500"></div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    Secure Inquiry Form
                    {prefillData && <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold uppercase tracking-wide">Payment Verified</span>}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                                placeholder="e.g. Rahul Verma"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="+91..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Details / Specific Requirements</label>
                        <textarea
                            name="details"
                            rows={4}
                            value={formData.details}
                            onChange={handleChange}
                            className="w-full px-5 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none font-medium text-slate-900 resize-none placeholder:text-slate-400 leading-relaxed"
                            placeholder="Please provide any known details about the person (location, age, workplace) or describe your ideal match criteria..."
                        ></textarea>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <input 
                            type="checkbox" 
                            id="consent" 
                            name="consent" 
                            required 
                            checked={formData.consent}
                            onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                            className="mt-1 w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer" 
                        />
                        <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                            <strong>Service Acknowledgment:</strong> I understand that Duoplee is an investigative research service. 
                            Results rely on public records and social footprint data. Payment covers the expert time and tools used 
                            for the search, not a guaranteed relationship outcome.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="group w-full bg-slate-900 text-white font-bold py-5 rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        <span>Submit Secure Request</span> 
                        <div className="bg-white/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                             <Send size={16} />
                        </div>
                    </button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;