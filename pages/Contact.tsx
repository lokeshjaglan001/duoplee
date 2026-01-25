import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

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

  // Prefill data from payment step
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
    
    // Format matches for the Admin email
    const matchString = prefillData?.generatedMatches 
      ? prefillData.generatedMatches.map((m, i) => 
          `${i + 1}. Handle: ${m.handle}\n   Category: ${m.niche}\n   Age: ${m.age || 'N/A'}\n   Location: ${m.location || 'N/A'}\n   Job: ${m.occupation || 'N/A'}`
        ).join('\n\n')
      : 'No matches generated automatically.';

    // Construct email body
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
Delivery Mode: ${prefillData?.mode || 'Standard'}
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

    // Use mailto to open email client
    window.location.href = `mailto:lokeshjaglan01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (submitted) {
    return (
        <div id="contact" className="min-h-[60vh] bg-white flex items-center justify-center py-20 px-4">
            <div className="max-w-xl w-full text-center space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-slate-900">Inquiry Sent Successfully</h2>
                
                <p className="text-slate-600 text-lg">
                    Thank you, {formData.name}. We have received your payment details and preferences.
                </p>
                
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Mail size={18} className="text-rose-600"/> What happens next?
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Based on your selected plan, our system has automatically allocated 
                    <strong className="text-slate-900"> {prefillData?.generatedMatches?.length || 5} random profiles</strong>.
                    These will be sent to <strong>{formData.email}</strong> via a secure professional email.
                  </p>
                  <p className="text-slate-600 text-sm">
                    <strong>Expected Delivery:</strong> {prefillData?.mode === 'express' ? 'Within 24 Hours' : 'Within 7 Days'}
                  </p>
                </div>

                {/* MANDATORY DISCLAIMER */}
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-left">
                   <div className="flex items-start gap-3">
                     <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                     <div className="space-y-2">
                       <h4 className="font-bold text-rose-800 text-sm uppercase tracking-wide">Important Disclaimer</h4>
                       <p className="text-rose-900/80 text-xs leading-relaxed font-medium">
                         Please note that the Instagram profiles sent to you are selected randomly based on our database. 
                         <strong>We do not guarantee that you will receive a response</strong> from these individuals. 
                         The outcome completely depends on luck and mutual interest.
                       </p>
                       <p className="text-rose-900/80 text-xs leading-relaxed font-medium">
                         If you do not find a match this time, you are welcome to try again on the website.
                       </p>
                     </div>
                   </div>
                </div>

                <p className="text-slate-400 text-xs italic">
                    Please ensure you clicked "Send" in your email app to finalize the administrative record.
                </p>

                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-block mt-8 text-rose-600 font-semibold hover:text-rose-800"
                >
                  Return to Top
                </button>
            </div>
        </div>
    );
  }

  return (
    <div id="contact" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12">
            
          {/* Sidebar / Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">Contact Us</h3>
                <div className="space-y-6">
                    <div className="flex items-start">
                        <Mail className="w-5 h-5 text-rose-600 mt-1 mr-4" />
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Email</h4>
                            <p className="text-slate-600">concierge@duoplee.com</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Phone className="w-5 h-5 text-rose-600 mt-1 mr-4" />
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Phone</h4>
                            <p className="text-slate-600">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-rose-600 mt-1 mr-4" />
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Headquarters</h4>
                            <p className="text-slate-600">Cyber City, Tower B<br/>New Delhi, India</p>
                        </div>
                    </div>
                </div>
            </div>

            {prefillData && (
                <div className="bg-rose-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden animate-fade-in-up">
                    <div className="relative z-10">
                        <h3 className="font-serif text-xl font-bold mb-4 text-rose-100">Order Summary</h3>
                        <div className="space-y-2 text-sm text-rose-200">
                            <div className="flex justify-between">
                                <span>Plan:</span>
                                <span className="font-bold text-white">{prefillData.plan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Preference:</span>
                                <span className="font-bold text-white capitalize">{prefillData.genderPreference}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span className="font-bold text-white capitalize">{prefillData.mode}</span>
                            </div>
                            <div className="w-full h-px bg-rose-800 my-3"></div>
                            <div className="flex justify-between text-lg">
                                <span>Total:</span>
                                <span className="font-bold text-white">₹{prefillData.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500 rounded-full blur-3xl opacity-20"></div>
                </div>
            )}
          </div>

          {/* Main Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Secure Inquiry</h2>
                <p className="text-slate-500 mb-8">Please provide your details below. All information is encrypted and handled with strict confidentiality.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition outline-none text-slate-900"
                                placeholder="e.g. Rahul Verma"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition outline-none text-slate-900"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition outline-none text-slate-900"
                            placeholder="+91..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Additional Details</label>
                        <textarea
                            name="details"
                            rows={4}
                            value={formData.details}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition outline-none text-slate-900 resize-none"
                            placeholder="Please describe any specific requirements or information about the person you are looking for..."
                        ></textarea>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                        <input 
                            type="checkbox" 
                            id="consent" 
                            name="consent" 
                            required 
                            checked={formData.consent}
                            onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                            className="mt-1 w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500" 
                        />
                        <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                            I acknowledge that this is an investigative service. Results depend on public data availability. I understand that payment is for the research effort and time, and specific outcomes (such as a guaranteed date or relationship) cannot be promised.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition duration-300 flex items-center justify-center gap-2 shadow-xl shadow-rose-200"
                    >
                        Submit Request <Send size={18} />
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