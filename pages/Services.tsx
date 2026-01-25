import React, { useState } from 'react';
import { Check, Zap, Star, Shield, Search, Heart, X, Smartphone, ArrowRight, CheckCircle, User, Mail, CreditCard } from 'lucide-react';
import { DeliveryMode } from '../types';

interface ServicesProps {
  onPlanPaymentComplete: (data: any) => void;
}

// --- CONFIGURATION: PASTE YOUR PROFILES HERE ---
const INSTAGRAM_PROFILES_DATABASE = [
  { handle: '@travel_wanderer_99', niche: 'Travel', age: 26, location: 'Mumbai', occupation: 'Marketing Executive' },
  { handle: '@fitness_guru_22', niche: 'Fitness', age: 29, location: 'Delhi', occupation: 'Personal Trainer' },
  { handle: '@bookworm_sarah', niche: 'Literature', age: 25, location: 'Bangalore', occupation: 'Content Writer' },
  { handle: '@tech_enthusiast_x', niche: 'Tech', age: 31, location: 'Hyderabad', occupation: 'Software Engineer' },
  { handle: '@coffee_lover_delhi', niche: 'Lifestyle', age: 27, location: 'New Delhi', occupation: 'Architect' },
  { handle: '@artistic_soul_mumbai', niche: 'Art', age: 24, location: 'Pune', occupation: 'Graphic Designer' },
  { handle: '@foodie_adventures_in', niche: 'Food', age: 28, location: 'Chandigarh', occupation: 'Restaurateur' },
  { handle: '@music_vibes_only', niche: 'Music', age: 23, location: 'Goa', occupation: 'Musician' },
  { handle: '@startup_hustler_bg', niche: 'Business', age: 32, location: 'Bangalore', occupation: 'Product Manager' },
  { handle: '@nature_clicks_official', niche: 'Photography', age: 30, location: 'Manali', occupation: 'Photographer' },
  { handle: '@fashion_ista_diva', niche: 'Fashion', age: 26, location: 'Mumbai', occupation: 'Fashion Stylist' },
  { handle: '@gamer_pro_zone', niche: 'Gaming', age: 22, location: 'Hyderabad', occupation: 'Streamer' },
  { handle: '@yoga_peace_mind', niche: 'Wellness', age: 33, location: 'Rishikesh', occupation: 'Yoga Instructor' },
  { handle: '@pet_lover_club', niche: 'Animals', age: 27, location: 'Chennai', occupation: 'Veterinarian' },
  { handle: '@cinema_buff_central', niche: 'Movies', age: 29, location: 'Mumbai', occupation: 'Assistant Director' },
  { handle: '@finance_wizard_01', niche: 'Finance', age: 34, location: 'Gurgaon', occupation: 'Investment Banker' },
  { handle: '@medical_life_dr', niche: 'Health', age: 30, location: 'Delhi', occupation: 'Doctor' },
  { handle: '@legal_eagle_law', niche: 'Law', age: 28, location: 'Mumbai', occupation: 'Corporate Lawyer' },
  { handle: '@chef_master_ind', niche: 'Culinary', age: 31, location: 'Kolkata', occupation: 'Head Chef' },
  { handle: '@dance_rhythm_soul', niche: 'Arts', age: 25, location: 'Bangalore', occupation: 'Choreographer' }
];

const Services: React.FC<ServicesProps> = ({ onPlanPaymentComplete }) => {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('standard');
  const [gender, setGender] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // New state for payment form user details
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '' });

  const plans = [
    {
      id: 'basic',
      title: 'Social Discovery',
      icon: Search,
      price: 1000,
      matchCount: 3, // How many profiles to give
      description: 'Ideal for finding a specific person from a physical encounter or limited information.',
      features: [
        '3 Random Instagram Matches',
        'Profile Verification',
        'Public Data Summary',
        'Secure Email Delivery'
      ],
      cta: 'Start Search',
      highlight: false
    },
    {
      id: 'standard',
      title: 'Partner Search',
      icon: Heart,
      price: 5000,
      matchCount: 7, // How many profiles to give
      description: 'Comprehensive search for serious relationship seekers looking for compatibility.',
      features: [
        '7 Random Instagram Matches',
        'Relationship Status Check',
        'Interest & Hobby Analysis',
        'Digital Footprint Report',
        'Compatibility Score'
      ],
      cta: 'Find Partner',
      highlight: true
    },
    {
      id: 'premium',
      title: 'Soulmate Protocol',
      icon: Star,
      price: 10000,
      matchCount: 15, // How many profiles to give
      description: 'The ultimate deep-dive for high-stakes matchmaking and complete peace of mind.',
      features: [
        '15 Random Instagram Matches',
        'Detailed Personality Profile',
        'Family & Lifestyle Overview',
        'In-depth Compatibility Report',
        'Priority Case Manager',
        'Post-Delivery Support'
      ],
      cta: 'Get Premium',
      highlight: false
    },
  ];

  const getPrice = (base: number) => deliveryMode === 'express' ? base + 500 : base;

  const handlePlanClick = (plan: any) => {
    if (!gender) {
      alert("Please select your preference (Man/Woman) at the top before choosing a plan.");
      return;
    }
    setSelectedPlan(plan);
    setPaymentForm({ name: '', email: '' }); // Reset form on new click
    setShowPaymentModal(true);
  };

  const isPaymentFormValid = paymentForm.name.trim().length > 0 && paymentForm.email.trim().includes('@');

  // Logic to randomly select profiles
  const getRandomProfiles = (count: number) => {
    // Shuffle array
    const shuffled = [...INSTAGRAM_PROFILES_DATABASE].sort(() => 0.5 - Math.random());
    // Get sub-array of first n elements
    return shuffled.slice(0, count);
  };

  const handlePayClick = (e: React.MouseEvent) => {
    if (!isPaymentFormValid) {
      e.preventDefault();
      return;
    }

    // Wait for the app launch attempt then scroll to contact
    setTimeout(() => {
      if (selectedPlan) {
        setShowPaymentModal(false);

        // Generate the random matches immediately
        const matches = getRandomProfiles(selectedPlan.matchCount);

        onPlanPaymentComplete({
          plan: selectedPlan.title,
          price: getPrice(selectedPlan.price),
          mode: deliveryMode,
          genderPreference: gender,
          paymentInitiated: true,
          payerName: paymentForm.name,
          payerEmail: paymentForm.email,
          generatedMatches: matches // Pass these to the contact form/email logic
        });
        
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 5000); // 5 second delay to allow app to open
  };

  const getPaymentLink = (app: 'generic' | 'gpay' | 'phonepe' | 'paytm') => {
    const base = `pa=8930963832@okaxis&pn=Duoplee&am=${getPrice(selectedPlan?.price || 0)}&cu=INR`;
    
    switch (app) {
        case 'gpay': return `gpay://upi/pay?${base}`;
        case 'phonepe': return `phonepe://pay?${base}`;
        case 'paytm': return `paytmmp://pay?${base}`;
        default: return `upi://pay?${base}`;
    }
  };

  return (
    <div id="services" className="bg-slate-50 min-h-screen pb-24 pt-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-rose-600 font-bold tracking-widest uppercase text-sm mb-3">Service Packages</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Invest in Your Future</h1>
          <p className="text-lg text-slate-600">
            Transparent pricing for professional investigative matchmaking. <br className="hidden md:block"/>
            Choose the level of depth that suits your needs.
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-2 mb-20 max-w-4xl mx-auto border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Gender Selection */}
            <div className="p-6 md:border-r border-slate-100 flex flex-col items-center justify-center">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">I am seeking a</span>
               <div className="flex gap-4 w-full max-w-xs">
                 <button 
                   onClick={() => setGender('female')}
                   className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all border-2 ${
                     gender === 'female' 
                     ? 'border-rose-500 bg-rose-50 text-rose-700' 
                     : 'border-slate-100 bg-white text-slate-500 hover:border-rose-200'
                   }`}
                 >
                   Woman
                 </button>
                 <button 
                   onClick={() => setGender('male')}
                   className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all border-2 ${
                     gender === 'male' 
                     ? 'border-slate-800 bg-slate-800 text-white' 
                     : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                   }`}
                 >
                   Man
                 </button>
               </div>
            </div>

            {/* Turnaround Time */}
            <div className="p-6 flex flex-col items-center justify-center">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Turnaround Time</span>
               <div className="flex bg-slate-100 p-1.5 rounded-xl w-full max-w-xs relative">
                  <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-out ${
                      deliveryMode === 'express' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
                    }`}
                  />
                  <button
                    onClick={() => setDeliveryMode('standard')}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors ${deliveryMode === 'standard' ? 'text-slate-900' : 'text-slate-500'}`}
                  >
                    Standard (7 Days)
                  </button>
                  <button
                    onClick={() => setDeliveryMode('express')}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${deliveryMode === 'express' ? 'text-amber-600' : 'text-slate-500'}`}
                  >
                    <Zap size={14} className={deliveryMode === 'express' ? 'fill-current' : ''} /> Express
                  </button>
               </div>
               {deliveryMode === 'express' && <span className="text-[10px] text-amber-600 font-medium mt-2 animate-pulse">+ ₹500 Priority Surcharge</span>}
            </div>

          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`group relative bg-white rounded-[2rem] transition-all duration-500 flex flex-col h-full ${
                plan.highlight 
                  ? 'border-2 border-rose-500 shadow-2xl shadow-rose-900/10 scale-100 md:-mt-8 md:mb-8 z-10' 
                  : 'border border-slate-200 shadow-lg hover:shadow-xl hover:border-rose-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="bg-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 md:p-10 flex-grow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.highlight ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors'
                }`}>
                  <plan.icon size={24} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-slate-900">₹{getPrice(plan.price).toLocaleString()}</span>
                  <span className="text-slate-400 text-sm font-medium">/ search</span>
                </div>

                <div className="w-full h-px bg-slate-100 mb-8"></div>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-slate-600 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                  {deliveryMode === 'express' && (
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <Zap size={12} className="text-amber-600 fill-amber-600" />
                      </div>
                      <span className="text-slate-900 text-sm font-bold">24-Hour Delivery</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="p-8 md:p-10 pt-0 mt-auto">
                <button
                  onClick={() => handlePlanClick(plan)}
                  className={`block w-full py-4 rounded-xl text-center font-bold text-sm transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 hover:shadow-rose-300'
                      : gender 
                        ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {gender ? plan.cta : 'Select Gender First'}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                  <Shield size={10} /> Secure Enquiry
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowPaymentModal(false)}
            ></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
                 <h3 className="text-lg font-serif font-bold text-slate-900">Secure Payment</h3>
                 <button 
                   onClick={() => setShowPaymentModal(false)}
                   className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                 >
                   <X size={20} className="text-slate-500" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">Total Amount Payable</p>
                  <div className="text-4xl font-bold text-slate-900">
                    ₹{getPrice(selectedPlan.price).toLocaleString()}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold">
                    {selectedPlan.title} {deliveryMode === 'express' && '+ Express'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 mb-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Smartphone size={100} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-4">Pay via Google Pay / UPI</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold tracking-wide">Duoplee</p>
                        <p className="text-blue-200 text-xs mt-1 flex items-center gap-1">
                          <CheckCircle size={12} className="text-blue-200" /> Official Business Account
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details Form in Modal */}
                <div className="space-y-4 mb-6">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Required Details for Payment</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={paymentForm.name}
                      onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 transition sm:text-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter Email Address"
                      value={paymentForm.email}
                      onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500 transition sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select Payment App</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('gpay') : '#'}
                      onClick={handlePayClick}
                      className={`py-3 px-4 rounded-xl font-bold text-sm text-center border transition-all ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-700 cursor-pointer' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Google Pay
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('phonepe') : '#'}
                      onClick={handlePayClick}
                      className={`py-3 px-4 rounded-xl font-bold text-sm text-center border transition-all ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-purple-700 cursor-pointer' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      PhonePe
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('paytm') : '#'}
                      onClick={handlePayClick}
                      className={`py-3 px-4 rounded-xl font-bold text-sm text-center border transition-all ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 cursor-pointer' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Paytm
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('generic') : '#'}
                      onClick={handlePayClick}
                      className={`py-3 px-4 rounded-xl font-bold text-sm text-center border transition-all ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-700 cursor-pointer' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Other UPI
                    </a>
                  </div>
                </div>
                
                <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
                  * <strong>Mobile Only:</strong> Please select the UPI app installed on your device. 
                  <br/>
                  * By clicking an option, the system will open the selected payment app and then proceed to the inquiry form.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;