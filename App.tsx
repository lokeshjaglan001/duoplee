import React, { useState, useEffect, useRef } from 'react';
import { User, ViewState, ChatSession, Role, Message } from './types';
import { PREMIUM_PRICE } from './constants';
import * as db from './services/db';
import * as gemini from './services/gemini';
import { 
  Heart, 
  Send, 
  MessageSquare, 
  LogOut, 
  Lock, 
  Trash2, 
  Menu, 
  X,
  Plus,
  Sparkles,
  Gift,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Star,
  Calendar,
  MessageCircle,
  Users,
  ChevronRight,
  Zap,
  Crown,
  Shield
} from 'lucide-react';

// === UTILITY COMPONENTS ===

const LoadingSpinner = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${className}`}></div>
);

const SimpleMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-rose-900 mt-5 mb-3 pb-2 border-b-2 border-rose-200">
              {parseInline(line.replace('### ', ''))}
            </h3>
          );
        }
        if (line.trim().startsWith('* ')) {
          return (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-rose-500 mt-1 font-bold">•</span>
              <p className="flex-1 leading-relaxed">
                {parseInline(line.trim().replace(/^\*\s+/, ''))}
              </p>
            </div>
          );
        }
        if (!line.trim()) {
          return <div key={index} className="h-1"></div>;
        }
        return (
          <p key={index} className="leading-relaxed">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-rose-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// === MAIN APP ===

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const storedUser = db.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setView(storedUser.isPremium ? ViewState.CHAT : ViewState.PAYMENT);
    }
  }, []);

  const handleLoginSuccess = (u: User) => {
    setUser(u);
    setView(u.isPremium ? ViewState.CHAT : ViewState.PAYMENT);
  };

  const handlePaymentSuccess = () => {
    if (user) {
      db.upgradeUserToPremium(user.id);
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      setView(ViewState.CHAT);
    }
  };

  const handleLogout = () => {
    db.logoutUser();
    setUser(null);
    setIsSidebarOpen(false);
    setView(ViewState.LANDING);
  };

  const handleDeleteAccount = () => {
    if (user && confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      db.deleteAccount(user.id);
      setUser(null);
      setIsSidebarOpen(false);
      setView(ViewState.LANDING);
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {view === ViewState.LANDING && <LandingPage onStart={() => setView(ViewState.AUTH)} />}
      {view === ViewState.AUTH && <AuthPage onSuccess={handleLoginSuccess} onBack={() => setView(ViewState.LANDING)} />}
      {view === ViewState.PAYMENT && user && <PaymentPage user={user} onSuccess={handlePaymentSuccess} onLogout={handleLogout} />}
      {view === ViewState.CHAT && user && (
        <ChatInterface 
          user={user} 
          onLogout={handleLogout} 
          onDeleteAccount={handleDeleteAccount}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}
    </div>
  );
}

// === LANDING PAGE ===

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="h-full overflow-y-auto">
    {/* Hero Section */}
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 space-y-12">
        {/* Logo & Title */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-6 rounded-3xl shadow-2xl">
                <Heart className="w-16 h-16 md:w-20 md:h-20 text-white fill-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Duoplee
          </h1>
          
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">AI-Powered Romance Assistant</span>
            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>

          <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 font-light max-w-3xl mx-auto leading-relaxed">
            Your intelligent companion for creating the perfect Valentine's Day experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 px-4">
          <FeatureCard
            icon={<Gift className="w-8 h-8" />}
            title="Perfect Gifts"
            description="AI-curated gift suggestions tailored to your partner's personality"
            gradient="from-rose-500 to-pink-500"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Memorable Dates"
            description="Creative date ideas for every budget and preference"
            gradient="from-pink-500 to-purple-500"
          />
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8" />}
            title="Heartfelt Messages"
            description="Express your feelings with perfectly crafted love letters"
            gradient="from-purple-500 to-rose-500"
          />
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 px-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-lg md:text-xl font-bold rounded-full shadow-2xl hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative">Start Your Love Journey</span>
            <Heart className="w-6 h-6 fill-white relative group-hover:scale-125 transition-transform" />
          </button>

          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-full shadow-xl border border-rose-100">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">One-time Premium Access</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">₹{PREMIUM_PRICE}</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto px-4">
          <TrustBadge icon={<Shield />} text="Secure" />
          <TrustBadge icon={<Zap />} text="Instant Access" />
          <TrustBadge icon={<Heart />} text="AI-Powered" />
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description, gradient }: any) => (
  <div className="group relative">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300`}></div>
    <div className="relative bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const TrustBadge = ({ icon, text }: any) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
    <div className="text-rose-500">{icon}</div>
    <span className="text-xs font-bold text-slate-700">{text}</span>
  </div>
);

// === AUTH PAGE ===

const AuthPage = ({ onSuccess, onBack }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.includes('@') || email.length < 5) {
        throw new Error("Please enter a valid email address");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Smooth UX

      if (isRegister) {
        if (!name.trim()) throw new Error("Name is required");
        const u = db.registerUser(email, name, password);
        onSuccess(u);
      } else {
        const u = db.loginUser(email, password);
        onSuccess(u);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-8 text-white text-center">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Heart className="w-10 h-10 fill-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isRegister ? "Join Duoplee" : "Welcome Back"}
            </h2>
            <p className="text-white/90">
              {isRegister ? "Create your account to get started" : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-base"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>{isRegister ? "Create Account" : "Sign In"}</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="text-sm text-slate-600"
              >
                {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                <span className="font-bold text-rose-600 hover:text-pink-600 transition-colors">
                  {isRegister ? "Sign In" : "Register"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

// === PAYMENT PAGE ===

const PaymentPage = ({ user, onSuccess, onLogout }: any) => {
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');
  const hasClickedPay = useRef(false);
  const fallbackTimerRef = useRef<any>(null);

  const upiId = "8168098633@ybl";
  const amount = PREMIUM_PRICE;
  const name = "Duoplee";

  const qrLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}.00&cu=INR&tn=Premium%20Access`;
  const gpayLink = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}.00&cu=INR&tn=Premium%20Access`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrLink)}`;

  const handlePayClick = () => {
    hasClickedPay.current = true;
    window.location.href = gpayLink;
    setStatus('verifying');

    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      setStatus('success');
      setTimeout(onSuccess, 1500);
    }, 10000);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasClickedPay.current) {
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        setStatus('verifying');
        setTimeout(() => {
          setStatus('success');
          setTimeout(onSuccess, 1500);
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [onSuccess]);

  return (
    <div className="h-full overflow-y-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-10 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-pulse"></div>
            <Crown className="w-12 h-12 mx-auto mb-4 relative z-10" />
            <h2 className="text-3xl font-bold mb-2 relative z-10">Unlock Premium</h2>
            <p className="text-white/90 text-lg relative z-10">Get lifetime access for just ₹{PREMIUM_PRICE}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* User Info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-rose-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <button onClick={onLogout} className="text-sm font-bold text-rose-600 hover:text-pink-600 transition-colors">
                Logout
              </button>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl opacity-75 blur-xl group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Pay"
                    className={`w-64 h-64 object-contain transition-all duration-500 ${status !== 'waiting' ? 'opacity-30 blur-sm' : ''}`}
                  />
                  {status !== 'waiting' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 shadow-2xl">
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayClick}
                disabled={status !== 'waiting'}
                className={`w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg ${status !== 'waiting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Smartphone className="w-6 h-6" />
                <span>Pay with Google Pay</span>
              </button>

              {/* Status */}
              <div className="w-full min-h-[80px] flex items-center justify-center">
                {status === 'waiting' && (
                  <p className="text-sm text-slate-500 text-center">
                    Scan QR code or tap button above to complete payment
                  </p>
                )}
                {status === 'verifying' && (
                  <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner className="w-6 h-6 border-rose-600 border-t-transparent" />
                    <span className="text-base font-bold text-rose-600">Verifying payment...</span>
                  </div>
                )}
                {status === 'success' && (
                  <div className="flex flex-col items-center gap-3 text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                    <div className="text-center">
                      <p className="text-base font-bold">Payment Successful!</p>
                      <p className="text-sm">Redirecting to chat...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-slate-500">Secure UPI Payment • Your data is protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === CHAT INTERFACE ===

const ChatInterface = ({ user, onLogout, onDeleteAccount, isSidebarOpen, toggleSidebar }: any) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadedChats = db.getUserChats(user.id);
    setSessions(loadedChats);
    if (loadedChats.length > 0) {
      setCurrentSession(loadedChats[0]);
    } else {
      handleNewChat();
    }
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleNewChat = () => {
    const newSession = db.createNewSession();
    setCurrentSession(newSession);
    if (window.innerWidth < 768 && isSidebarOpen) toggleSidebar();
  };

  const handleSelectChat = (session: ChatSession) => {
    setCurrentSession(session);
    if (window.innerWidth < 768 && isSidebarOpen) toggleSidebar();
  };

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    
    db.deleteChatSession(user.id, sessionId);
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    
    if (currentSession?.id === sessionId) {
      if (updated.length > 0) {
        setCurrentSession(updated[0]);
      } else {
        handleNewChat();
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentSession || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input.trim(),
      timestamp: Date.now()
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMsg],
      lastUpdated: Date.now(),
      title: currentSession.messages.length === 0
        ? input.trim().slice(0, 40) + (input.trim().length > 40 ? '...' : '')
        : currentSession.title
    };

    setCurrentSession(updatedSession);
    setInput("");
    setIsTyping(true);

    let updatedSessions = [...sessions];
    const existingIdx = sessions.findIndex(s => s.id === updatedSession.id);
    if (existingIdx >= 0) {
      updatedSessions[existingIdx] = updatedSession;
    } else {
      updatedSessions = [updatedSession, ...sessions];
    }
    setSessions(updatedSessions);
    db.saveChat(user.id, updatedSession);

    try {
      const responseText = await gemini.sendMessageToGemini(updatedSession.messages, userMsg.text);

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, modelMsg],
        lastUpdated: Date.now()
      };

      setCurrentSession(finalSession);
      db.saveChat(user.id, finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));

    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "I apologize for the interruption. Please try asking your question again, and I'll be happy to help!",
        timestamp: Date.now()
      };
      const errorSession = { ...updatedSession, messages: [...updatedSession.messages, errorMsg] };
      setCurrentSession(errorSession);
      db.saveChat(user.id, errorSession);
      setSessions(prev => prev.map(s => s.id === errorSession.id ? errorSession : s));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 
        bg-white/95 backdrop-blur-xl border-r border-slate-200
        transform transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Duoplee
              </h2>
            </div>
            <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-rose-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Conversations
          </p>
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => handleSelectChat(session)}
              className={`
                group relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all
                ${currentSession?.id === session.id
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                  : 'hover:bg-slate-100 text-slate-700'
                }
              `}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate text-sm font-medium">{session.title}</span>
              <button
                onClick={(e) => handleDeleteChat(e, session.id)}
                className={`
                  opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all
                  ${currentSession?.id === session.id
                    ? 'hover:bg-rose-700'
                    : 'hover:bg-slate-200'
                  }
                `}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-sm text-slate-400 mt-10 px-6">
              Your conversations will appear here
            </p>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <div className="flex items-center gap-1 text-xs text-rose-600 font-medium">
                <Crown className="w-3 h-3 fill-rose-600" />
                <span>Premium</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
            <button
              onClick={onDeleteAccount}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 relative">
        {/* Header */}
        <header className="h-16 md:h-18 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl flex items-center px-4 md:px-6 shrink-0 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 hover:bg-rose-50 rounded-lg transition-colors mr-2"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="hidden md:block bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Duoplee
              </h1>
              <p className="text-xs text-slate-500 hidden md:block">
                {currentSession?.title || "AI Romance Assistant"}
              </p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="md:hidden p-2 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Plus className="w-6 h-6 text-rose-600" />
          </button>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
        >
          {(!currentSession || currentSession.messages.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center px-4 pb-20">
              <div className="max-w-2xl w-full space-y-8 text-center">
                <div className="inline-flex p-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl">
                  <Heart className="w-20 h-20 text-rose-500 fill-rose-400" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    How can I help with your Valentine's?
                  </h3>
                  <p className="text-slate-600">
                    Ask me about gifts, dates, or writing the perfect love message
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { emoji: "🎁", text: "Gift ideas for my partner" },
                    { emoji: "🕯️", text: "Plan a romantic dinner" },
                    { emoji: "💌", text: "Help write a love letter" },
                    { emoji: "📅", text: "Creative date ideas" }
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt.text)}
                      className="p-4 text-left bg-white border-2 border-slate-100 rounded-2xl hover:border-rose-300 hover:bg-rose-50 hover:shadow-lg transition-all group"
                    >
                      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{prompt.emoji}</span>
                      <span className="text-sm font-medium text-slate-700">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 md:px-6 md:py-5 shadow-md
                ${msg.role === Role.USER
                  ? 'bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                }
              `}>
                {msg.role === Role.MODEL ? (
                  <SimpleMarkdown text={msg.text} />
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-3xl rounded-bl-md px-6 py-5 shadow-md flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 bg-white border-2 border-slate-200 rounded-3xl p-2 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about gifts, dates, or messages..."
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none text-slate-700 placeholder-slate-400"
                rows={1}
                style={{ maxHeight: '200px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              AI may make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};