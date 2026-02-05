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
  ArrowRight,
  Zap,
  Star,
  Calendar,
  MessageCircle
} from 'lucide-react';

// --- Utility Components ---

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
);

const DarkLoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-600 border-t-transparent"></div>
);

// Enhanced Markdown parser with better styling
const SimpleMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        // Headers (###)
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-serif font-bold text-rose-900 mt-5 mb-3 border-b-2 border-rose-200/50 pb-2">
              {parseInline(line.replace('### ', ''))}
            </h3>
          );
        }
        // Bullet points (*)
        if (line.trim().startsWith('* ')) {
          return (
            <div key={index} className="flex gap-3 ml-1 items-start">
              <span className="text-rose-500 mt-1.5 text-lg font-bold">•</span>
              <p className="flex-1 leading-relaxed">
                {parseInline(line.trim().replace(/^\*\s+/, ''))}
              </p>
            </div>
          );
        }
        // Empty lines
        if (!line.trim()) {
          return <div key={index} className="h-2"></div>;
        }
        // Regular paragraphs
        return (
          <p key={index} className="leading-relaxed">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to parse bold (**text**)
const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-rose-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// --- Main App Component ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize user from local storage
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
    setView(ViewState.LANDING);
  };

  const handleDeleteAccount = () => {
    if (user && confirm("Are you sure you want to delete your account? This cannot be undone and you will lose your premium status.")) {
      db.deleteAccount(user.id);
      setUser(null);
      setView(ViewState.LANDING);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans text-slate-800 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 overflow-hidden">
      <div className="flex-1 h-full overflow-hidden relative">
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
    </div>
  );
}

// --- Sub-Components (Pages) ---

const LandingPage = ({ onStart }: { onStart: () => void }) => (
  <div className="h-full overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex flex-col items-center justify-center p-6 text-center relative">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>
    
    <div className="max-w-4xl space-y-10 animate-fade-in py-10 relative z-10">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-full shadow-2xl ring-4 ring-white">
            <Heart className="w-20 h-20 text-white fill-white animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-5xl md:text-8xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Duoplee
        </h1>
        <div className="flex items-center justify-center gap-2 text-rose-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-wider">Powered by AI</span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      
      <p className="text-xl md:text-3xl text-slate-700 font-light leading-relaxed max-w-3xl mx-auto">
        Your intelligent companion for the perfect Valentine's Day
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 text-left w-full">
        <FeatureCard 
          icon={<Gift className="w-7 h-7" />} 
          title="Perfect Gifts" 
          desc="AI-powered suggestions tailored to your partner's unique personality and interests."
          gradient="from-rose-500 to-pink-500"
        />
        <FeatureCard 
          icon={<Calendar className="w-7 h-7" />} 
          title="Romantic Dates" 
          desc="Creative and memorable date ideas crafted for any budget and preference."
          gradient="from-pink-500 to-red-500"
        />
        <FeatureCard 
          icon={<MessageCircle className="w-7 h-7" />} 
          title="Love Letters" 
          desc="Express your deepest feelings with perfectly crafted, heartfelt messages."
          gradient="from-red-500 to-rose-500"
        />
      </div>

      <div className="flex flex-col items-center gap-6 mt-12">
        <button 
          onClick={onStart}
          className="group relative px-10 py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 transform w-full md:w-auto overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-3">
            Start Your Journey 
            <Heart className="w-6 h-6 fill-white group-hover:scale-125 transition-transform duration-300" />
          </span>
        </button>
        
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-rose-100">
          <Zap className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-bold text-slate-700">One-time access fee</span>
          <span className="text-lg font-bold text-rose-600">₹{PREMIUM_PRICE}</span>
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc, gradient }: { icon: React.ReactNode, title: string, desc: string, gradient: string }) => (
  <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-rose-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
    <div className={`text-white mb-4 bg-gradient-to-br ${gradient} w-fit p-4 rounded-2xl shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const AuthPage = ({ onSuccess, onBack }: { onSuccess: (u: User) => void, onBack: () => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.includes('@') || email.length < 5) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
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
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 my-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-full">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {isRegister ? "Join Duoplee" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 mt-2">Sign in to access your romantic assistant</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-200 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
                placeholder="Romeo / Juliet"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
              placeholder="love@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all mt-4 text-base"
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          {isRegister ? "Already have an account?" : "New to Duoplee?"}{" "}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="font-bold text-rose-600 hover:text-pink-600 transition-colors"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
        
        <button onClick={onBack} className="w-full mt-8 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

const PaymentPage = ({ user, onSuccess, onLogout }: { user: User, onSuccess: () => void, onLogout: () => void }) => {
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');
  const hasClickedPay = useRef(false);
  const fallbackTimerRef = useRef<any>(null);
  
  const upiId = "mahavirjaglan1@oksbi";
  const amount = PREMIUM_PRICE;
  const name = "Duoplee";
  
  const qrLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}.00&cu=INR&tn=Premium%20Access`;
  const gpayLink = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}.00&cu=INR&tn=Premium%20Access`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrLink)}`;

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
    <div className="h-full overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-white/50 my-auto relative z-10">
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
          <Lock className="w-12 h-12 mx-auto mb-4 opacity-90 relative z-10" />
          <h2 className="text-3xl font-bold font-serif relative z-10">Premium Access</h2>
          <p className="opacity-90 mt-2 text-lg relative z-10">Unlock Duoplee for just ₹{PREMIUM_PRICE}</p>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 text-sm bg-gradient-to-r from-slate-50 to-rose-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name[0]}
              </div>
              <div>
                <p className="font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>
            <button onClick={onLogout} className="text-rose-600 hover:text-pink-600 font-bold text-sm transition-colors">
              Log out
            </button>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {/* QR Code */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 rounded-3xl opacity-75 blur-lg group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                <img 
                  src={qrCodeUrl} 
                  alt="Scan to Pay" 
                  className={`w-56 h-56 object-contain transition-all duration-500 ${status !== 'waiting' ? 'opacity-30 blur-sm scale-95' : ''}`}
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

            {/* GPay Button */}
            <div className="w-full">
              <button 
                onClick={handlePayClick}
                className={`w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg ${status !== 'waiting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={status !== 'waiting'}
              >
                <Smartphone className="w-6 h-6" /> 
                <span>Pay with Google Pay</span>
              </button>
            </div>

            <div className="w-full border-t-2 border-slate-100"></div>

            {/* Status Messages */}
            <div className="w-full flex flex-col items-center justify-center space-y-3 min-h-[80px]">
              {status === 'waiting' && (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Scan QR code or click button above</span>
                  </div>
                </div>
              )}
              
              {status === 'verifying' && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                  <DarkLoadingSpinner />
                  <span className="text-base font-bold text-rose-600">Verifying your payment...</span>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center gap-3 text-green-600 animate-in fade-in zoom-in slide-in-from-bottom-4">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-base font-bold">Payment Successful!</span>
                  <span className="text-sm">Redirecting to chat...</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-green-500" /> 
            <span>Secure payments via UPI • Your data is protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ 
  user, 
  onLogout, 
  onDeleteAccount, 
  isSidebarOpen, 
  toggleSidebar 
}: { 
  user: User, 
  onLogout: () => void, 
  onDeleteAccount: () => void,
  isSidebarOpen: boolean,
  toggleSidebar: () => void
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load Chats
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
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
    db.deleteChatSession(user.id, sessionId);
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (currentSession?.id === sessionId) {
      if (updated.length > 0) setCurrentSession(updated[0]);
      else handleNewChat();
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

    // Save session
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
      const responseText = await gemini.sendMessageToGemini(updatedSession.messages, input.trim());
      
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
        id: Date.now().toString(),
        role: Role.MODEL,
        text: "I apologize, but I encountered a brief interruption. Please try asking again.",
        timestamp: Date.now()
      };
      const errorSession = {...updatedSession, messages: [...updatedSession.messages, errorMsg]};
      setCurrentSession(errorSession);
      db.saveChat(user.id, errorSession);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 overflow-hidden relative">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        absolute md:relative inset-y-0 left-0 z-30 w-80 bg-white/95 backdrop-blur-xl border-r border-rose-100 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none h-full flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <h2 className="font-serif font-bold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Duoplee
            </h2>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-rose-500 hover:bg-rose-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all font-bold"
          >
            <Plus className="w-5 h-5" /> New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Chat History</p>
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => handleSelectChat(session)}
              className={`group relative flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all ${
                currentSession?.id === session.id 
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg scale-105' 
                  : 'text-slate-600 hover:bg-rose-50 hover:text-rose-900'
              }`}
            >
              <MessageSquare className={`w-5 h-5 shrink-0 ${currentSession?.id === session.id ? 'opacity-100' : 'opacity-60'}`} />
              <span className="truncate text-sm font-medium flex-1">{session.title}</span>
              <button 
                onClick={(e) => handleDeleteChat(e, session.id)}
                className={`absolute right-2 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                  currentSession?.id === session.id ? 'hover:bg-rose-700 text-white' : 'hover:bg-rose-200 text-rose-600'
                }`}
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-sm text-slate-400 mt-10 italic px-8">
              Your conversations will appear here
            </div>
          )}
        </div>

        <div className="p-4 border-t border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-rose-600" /> Premium Member
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onLogout} 
              className="flex items-center justify-center gap-2 text-xs font-bold p-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-slate-600 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button 
              onClick={onDeleteAccount} 
              className="flex items-center justify-center gap-2 text-xs font-bold p-3 rounded-xl bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/50 backdrop-blur-sm relative w-full">
        {/* Header */}
        <div className="h-20 border-b border-rose-100/50 flex items-center px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-10 shrink-0 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={toggleSidebar} 
              className="md:hidden p-2 -ml-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl shadow-lg hidden md:block">
                <Heart className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-serif font-bold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Duoplee
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden md:block">
                  {currentSession?.title || "Your AI Romance Assistant"}
                </p>
              </div>
            </div>

            <button 
              onClick={handleNewChat}
              className="md:hidden p-2 -mr-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth"
        >
          {(!currentSession || currentSession.messages.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center opacity-60 space-y-8 animate-fade-in pb-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-8 rounded-full">
                  <Heart className="w-20 h-20 text-rose-500 fill-rose-400" />
                </div>
              </div>
              <div className="text-center space-y-3 max-w-md px-4">
                <h3 className="text-2xl md:text-3xl font-serif bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  How can I help you love better?
                </h3>
                <p className="text-slate-600 text-base">Ask about gift ideas, date planning, or writing the perfect love letter.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                <button 
                  onClick={() => setInput("What are some unique gift ideas for my partner who loves tech?")} 
                  className="text-sm text-left p-4 bg-white border-2 border-rose-100 rounded-2xl hover:bg-rose-50 hover:border-rose-300 hover:shadow-lg transition-all text-slate-700 font-medium group"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🎁</span>
                  Gift for tech-loving partner
                </button>
                <button 
                  onClick={() => setInput("Plan a romantic dinner date at home for under ₹2000")} 
                  className="text-sm text-left p-4 bg-white border-2 border-rose-100 rounded-2xl hover:bg-rose-50 hover:border-rose-300 hover:shadow-lg transition-all text-slate-700 font-medium group"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🕯️</span>
                  Romantic dinner at home
                </button>
              </div>
            </div>
          )}
          
          {currentSession?.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className={`
                max-w-[90%] md:max-w-[80%] rounded-3xl px-6 py-5 md:px-7 md:py-6 shadow-lg text-sm md:text-base leading-relaxed
                ${msg.role === Role.USER 
                  ? 'bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-br-md' 
                  : 'bg-white border-2 border-rose-100 text-slate-800 rounded-bl-md'}
              `}>
                {msg.role === Role.MODEL ? (
                  <SimpleMarkdown text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white border-2 border-rose-100 shadow-lg rounded-3xl rounded-bl-md px-7 py-6 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </div>
            </div>
          )}
          <div className="h-1"></div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-rose-100/50 shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-white border-2 border-rose-200 rounded-3xl p-3 focus-within:ring-4 focus-within:ring-rose-500/20 focus-within:border-rose-400 transition-all shadow-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="What should I get for my partner..."
              className="w-full pl-4 py-3 bg-transparent border-none outline-none text-slate-700 placeholder-rose-300 resize-none max-h-40 min-h-[50px] text-base"
              rows={1}
              style={{ height: 'auto' }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="mb-1 mr-1 p-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0 hover:scale-110"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Duoplee may display inaccurate info. Please verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}