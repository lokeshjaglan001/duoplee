import React, { useState } from 'react';
import { Check, Star, Search, Heart, X, CheckCircle, User, Mail, Copy, QrCode, AlertCircle, Sparkles } from 'lucide-react';

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
  const [gender, setGender] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  // New state for payment form user details
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '' });

  const plans = [
    {
      id: 'basic',
      title: 'Social Discovery',
      icon: Search,
      price: 1000,
      matchCount: 3,
      description: 'Ideal for casual exploration or finding a specific person from a physical encounter.',
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
      matchCount: 7,
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
      matchCount: 15,
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
          price: selectedPlan.price,
          mode: 'Standard (7 Days)',
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

  const VPA = '8168098633@ybl';
  
  // Standard UPI String construction
  const getUpiString = () => {
    const amount = (selectedPlan?.price || 0).toFixed(2); // Ensure decimal format
    return `upi://pay?pa=${VPA}&am=${amount}&cu=INR`;
  };

  const getPaymentLink = (app: 'generic' | 'gpay' | 'phonepe' | 'paytm') => {
    const amount = (selectedPlan?.price || 0).toFixed(2);
    // Construct base arguments without the prefix
    const args = `pa=${VPA}&am=${amount}&cu=INR`;
    
    switch (app) {
        case 'gpay': return `gpay://upi/pay?${args}`;
        case 'phonepe': return `phonepe://pay?${args}`;
        case 'paytm': return `paytmmp://pay?${args}`;
        default: return `upi://pay?${args}`;
    }
  };

  const copyVpa = () => {
    navigator.clipboard.writeText(VPA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="services" className="bg-slate-50 min-h-screen pb-24 pt-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-100">
             <Sparkles size={14} /> Service Packages
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
            Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Future</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Transparent pricing for professional investigative matchmaking. 
            All plans include our rigorous 7-day verification process.
          </p>
        </div>

        {/* Modern Gender Selection */}
        <div className="flex flex-col items-center justify-center mb-16">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">I am seeking a</span>
           <div className="bg-white p-1.5 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 flex gap-2">
             <button 
               onClick={() => setGender('female')}
               className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                 gender === 'female' 
                 ? 'bg-rose-600 text-white shadow-md' 
                 : 'bg-transparent text-slate-500 hover:text-rose-600 hover:bg-rose-50'
               }`}
             >
               Woman
             </button>
             <button 
               onClick={() => setGender('male')}
               className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                 gender === 'male' 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
               }`}
             >
               Man
             </button>
           </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`group relative bg-white rounded-3xl transition-all duration-500 flex flex-col h-full overflow-hidden ${
                plan.highlight 
                  ? 'border-2 border-rose-500 shadow-2xl shadow-rose-200/50 scale-100 md:-mt-4 md:mb-4 z-10' 
                  : 'border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-rose-100 hover:-translate-y-1'
              }`}
            >
              {plan.highlight && (
                <div className="bg-rose-600 text-white text-[10px] font-bold py-1.5 text-center uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="p-8 flex-grow">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
                  plan.highlight ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors'
                }`}>
                  <plan.icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm font-medium">/ search</span>
                </div>

                <div className="w-full h-px bg-slate-50 mb-6"></div>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.highlight ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-3 opacity-60">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-slate-500" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">Standard 7-Day Delivery</span>
                  </li>
                </ul>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <button
                  onClick={() => handlePlanClick(plan)}
                  className={`block w-full py-4 rounded-xl text-center font-bold text-sm transition-all duration-300 transform active:scale-[0.98] ${
                    plan.highlight
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200'
                      : gender 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {gender ? plan.cta : 'Select Gender First'}
                </button>
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
            
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
                 <h3 className="text-lg font-serif font-bold text-slate-900">Secure Payment</h3>
                 <button 
                   onClick={() => setShowPaymentModal(false)}
                   className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                 >
                   <X size={20} className="text-slate-500" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                  <div className="text-4xl font-bold text-slate-900">
                    ₹{selectedPlan.price.toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm text-rose-600 font-medium bg-rose-50 inline-block px-3 py-1 rounded-full">
                    {selectedPlan.title} Package
                  </div>
                </div>

                {/* User Details Form in Modal */}
                <div className="space-y-4 mb-8">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Details</p>
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={paymentForm.name}
                        onChange={(e) => setPaymentForm({...paymentForm, name: e.target.value})}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition sm:text-sm"
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={paymentForm.email}
                        onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct App Links (PRIORITY) */}
                <div className="space-y-4 mb-8">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider text-center">Tap to Pay</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('gpay') : '#'}
                      onClick={handlePayClick}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm text-center border transition-all duration-300 transform active:scale-95 ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-800 cursor-pointer shadow-sm' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Google Pay
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('phonepe') : '#'}
                      onClick={handlePayClick}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm text-center border transition-all duration-300 transform active:scale-95 ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-purple-700 cursor-pointer shadow-sm' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      PhonePe
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('paytm') : '#'}
                      onClick={handlePayClick}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm text-center border transition-all duration-300 transform active:scale-95 ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 cursor-pointer shadow-sm' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Paytm
                    </a>
                    <a 
                      href={isPaymentFormValid ? getPaymentLink('generic') : '#'}
                      onClick={handlePayClick}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm text-center border transition-all duration-300 transform active:scale-95 ${
                         isPaymentFormValid 
                         ? 'border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-800 cursor-pointer shadow-sm' 
                         : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Other UPI
                    </a>
                  </div>
                </div>

                {/* QR CODE SECTION (BACKUP) */}
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-4">
                    <QrCode size={14} /> Or Scan QR Code
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-slate-100">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getUpiString())}`}
                      alt="Payment QR Code"
                      className="w-40 h-40 mix-blend-multiply"
                    />
                  </div>
                  
                  {/* Manual Copy */}
                  <div className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2.5">
                     <span className="text-xs font-mono text-slate-500 font-medium">{VPA}</span>
                     <button 
                       onClick={copyVpa}
                       className="text-rose-600 hover:text-rose-700 transition-colors p-1 hover:bg-rose-50 rounded"
                       title="Copy UPI ID"
                     >
                       {copied ? <Check size={16} /> : <Copy size={16} />}
                     </button>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 w-full">
                    <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-yellow-700 text-left leading-relaxed font-medium">
                      If "Self transfer" fails, please ask a friend to pay on your behalf using the QR code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;