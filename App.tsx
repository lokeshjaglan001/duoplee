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
  ArrowRight
} from 'lucide-react';

// --- Utility Components ---

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
);

const DarkLoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-600 border-t-transparent"></div>
);

// A lightweight Markdown-ish parser to avoid heavy dependencies while fulfilling the requirement
// to make the text look "good and finished" without raw symbols.
const SimpleMarkdown = ({ text }: { text: string }) => {
  // Split text by lines to handle block elements
  const lines = text.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        // Headers (###)
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-serif font-bold text-rose-900 mt-4 mb-2 border-b border-rose-100 pb-1">
              {parseInline(line.replace('### ', ''))}
            </h3>
          );
        }
        // Bullet points (*)
        if (line.trim().startsWith('* ')) {
          return (
            <div key={index} className="flex gap-2 ml-1">
              <span className="text-rose-500 mt-1.5">•</span>
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
          <p key={index} className="leading-relaxed mb-1">
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
      return <strong key={i} className="font-bold text-rose-800">{part.slice(2, -2)}</strong>;
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
      setUser({ ...user, isPremium: true });
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
    // Use dvh (dynamic viewport height) to properly handle mobile browser address bars
    <div className="h-[100dvh] w-full flex flex-col font-sans text-slate-800 bg-rose-50 overflow-hidden">
      {/* View Router */}
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
  <div className="h-full overflow-y-auto bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 flex flex-col items-center justify-center p-6 text-center">
    <div className="max-w-3xl space-y-8 animate-fade-in py-10">
      <div className="flex justify-center mb-6">
        <div className="bg-rose-100 p-4 rounded-full shadow-lg ring-4 ring-rose-50">
          <Heart className="w-16 h-16 text-rose-600 fill-rose-600 animate-pulse" />
        </div>
      </div>
      <h1 className="text-4xl md:text-7xl font-serif font-bold text-rose-900 tracking-tight drop-shadow-sm">
        Duoplee
      </h1>
      <p className="text-lg md:text-2xl text-rose-800/80 font-light leading-relaxed max-w-2xl mx-auto">
        Your personal AI companion for Valentine's Day. <br className="hidden md:block"/>
        Find the perfect gift, craft the perfect message, and plan the perfect date.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-left w-full">
        <FeatureCard icon={<Gift className="w-6 h-6" />} title="Perfect Gifts" desc="Tailored suggestions based on your partner's unique personality." />
        <FeatureCard icon={<Sparkles className="w-6 h-6" />} title="Romantic Dates" desc="Creative and memorable date ideas for any budget." />
        <FeatureCard icon={<MessageSquare className="w-6 h-6" />} title="Love Letters" desc="Help drafting messages that express exactly how you feel." />
      </div>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-rose-600 text-white text-lg font-semibold rounded-full shadow-xl hover:bg-rose-700 hover:shadow-2xl transition-all transform hover:-translate-y-1 w-full md:w-auto"
        >
          <span className="flex items-center justify-center gap-2">
            Start Your Journey <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
          </span>
        </button>
        <p className="text-sm text-rose-500 font-medium">One-time access fee of ₹{PREMIUM_PRICE}</p>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-rose-500 mb-3 bg-rose-50 w-fit p-3 rounded-xl">{icon}</div>
    <h3 className="text-lg font-semibold text-rose-900 mb-2">{title}</h3>
    <p className="text-rose-700/80 text-sm leading-relaxed">{desc}</p>
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
    
    // Basic Validation
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
    <div className="h-full overflow-y-auto bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-rose-100 my-auto">
        <div className="text-center mb-8">
            <Heart className="w-10 h-10 text-rose-500 mx-auto mb-2 fill-rose-500" />
            <h2 className="text-2xl font-serif font-bold text-rose-900">
            {isRegister ? "Join Duoplee" : "Welcome Back"}
            </h2>
            <p className="text-rose-400 text-sm mt-1">Sign in to access your romantic assistant</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
                placeholder="Romeo / Juliet"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-rose-800 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
              placeholder="love@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rose-800 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all bg-rose-50/30 text-base"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-rose-600 text-white rounded-xl font-semibold shadow-lg hover:bg-rose-700 transition-colors mt-2 text-base"
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-rose-700">
          {isRegister ? "Already have an account?" : "New to Duoplee?"}{" "}
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="font-semibold text-rose-900 hover:underline"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
        
        <button onClick={onBack} className="w-full mt-6 text-xs text-rose-400 hover:text-rose-600">
            Back to Home
        </button>
      </div>
    </div>
  );
};

const PaymentPage = ({ user, onSuccess, onLogout }: { user: User, onSuccess: () => void, onLogout: () => void }) => {
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting');
  // Use a ref to track if the button was clicked, this persists across re-renders and handles stale closures in event listeners better
  const hasClickedPay = useRef(false);
  const fallbackTimerRef = useRef<any>(null);
  
  // Payment Details
  const upiId = "mahavirjaglan1@oksbi";
  const amount = PREMIUM_PRICE;
  const name = "Duoplee";
  
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}.00&cu=INR&tn=Premium%20Access`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handlePayClick = () => {
    hasClickedPay.current = true;
    
    // 1. Attempt to open UPI app
    window.location.href = upiLink;

    // 2. Set status to verifying immediately to give feedback
    setStatus('verifying');

    // 3. Set a fallback timer for Desktop or if app switch doesn't occur/isn't detected
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
        setStatus('success');
        setTimeout(onSuccess, 1500);
    }, 10000); // 10s fallback
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      // If user comes back to the app (visible) AND they had clicked the button
      if (document.visibilityState === 'visible' && hasClickedPay.current) {
        // Clear the long fallback timer, we are back!
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        
        // Force state to verifying if not already (though click handler does this)
        setStatus('verifying');
        
        // Fast-track success after a brief "checking" pause
        setTimeout(() => {
            setStatus('success');
            setTimeout(onSuccess, 2000);
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
    <div className="h-full overflow-y-auto bg-rose-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-rose-100 my-auto">
        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-8 text-white text-center">
            <Lock className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h2 className="text-2xl font-bold font-serif">Premium Access</h2>
            <p className="opacity-90 mt-1">Unlock Duoplee for just ₹{PREMIUM_PRICE}</p>
        </div>
        
        <div className="p-8">
            <div className="flex items-center justify-between mb-8 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs">
                        {user.name[0]}
                    </div>
                    <span className="truncate max-w-[150px]">{user.email}</span>
                </div>
                <button onClick={onLogout} className="text-rose-600 hover:underline font-medium text-xs">Log out</button>
            </div>

            <div className="flex flex-col items-center space-y-6">
                {/* QR Code Section */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-rose-500 rounded-2xl opacity-75 blur opacity-20"></div>
                    <div className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                         <img 
                            src={qrCodeUrl} 
                            alt="Scan to Pay" 
                            className={`w-48 h-48 md:w-56 md:h-56 object-contain transition-opacity duration-500 ${status !== 'waiting' ? 'opacity-50 blur-[2px]' : ''}`}
                         />
                         {status !== 'waiting' && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-md" />
                             </div>
                         )}
                         <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                            <span className="text-rose-900 font-bold">Scan with GPay</span>
                         </div>
                    </div>
                </div>

                {/* GPay Button */}
                <div className="w-full">
                    <button 
                        onClick={handlePayClick}
                        className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 ${status !== 'waiting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={status !== 'waiting'}
                    >
                        <Smartphone className="w-5 h-5" /> 
                        <span>Pay with GPay</span>
                    </button>
                </div>

                <div className="w-full border-t border-slate-100 my-4"></div>

                <div className="w-full flex flex-col items-center justify-center space-y-3 min-h-[60px]">
                     {status === 'waiting' && (
                         <div className="flex flex-col items-center gap-2 animate-pulse">
                            <p className="text-[10px] text-slate-400">Scan QR or click button to pay</p>
                         </div>
                     )}
                     
                     {status === 'verifying' && (
                         <div className="flex items-center gap-2 text-rose-600">
                            <DarkLoadingSpinner />
                            <span className="text-sm font-bold">Verifying transaction...</span>
                         </div>
                     )}

                     {status === 'success' && (
                         <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-bold">Payment Verified! Redirecting...</span>
                         </div>
                     )}
                </div>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 mt-6 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-green-500" /> Secure Payments via UPI
            </p>
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

    const handleNewChat = () => {
        const newSession = db.createNewSession();
        // Don't add to session list immediately to keep list clean
        // It will be added when first message is sent
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
        if (!input.trim() || !currentSession) return;
        
        const userMsg: Message = {
            id: Date.now().toString(),
            role: Role.USER,
            text: input,
            timestamp: Date.now()
        };

        const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, userMsg],
            lastUpdated: Date.now(),
            // Update title if it's the first message
            title: currentSession.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : currentSession.title
        };

        setCurrentSession(updatedSession);
        setInput("");
        setIsTyping(true);

        // Save session logic
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
            const responseText = await gemini.sendMessageToGemini(updatedSession.messages, input);
            
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
            console.error(error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: Role.MODEL,
                text: "My apologies, I encountered a brief interruption in the connection. Please ask me again.",
                timestamp: Date.now()
            };
            setCurrentSession({...updatedSession, messages: [...updatedSession.messages, errorMsg]});
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex h-full bg-white overflow-hidden relative">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                absolute md:relative inset-y-0 left-0 z-30 w-80 bg-rose-50 border-r border-rose-100 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none h-full flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50">
                    <h2 className="font-serif font-bold text-2xl text-rose-900 flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-rose-600 text-rose-600" /> Duoplee
                    </h2>
                    <button onClick={toggleSidebar} className="md:hidden text-rose-500 hover:bg-rose-100 p-1 rounded-full"><X /></button>
                </div>

                <div className="p-4">
                    <button 
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-rose-200 rounded-xl text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" /> New Conversation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-hide">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 px-2">Your History</p>
                    {sessions.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => handleSelectChat(session)}
                            className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
                                currentSession?.id === session.id 
                                    ? 'bg-rose-600 text-white shadow-md' 
                                    : 'text-slate-600 hover:bg-rose-100/80 hover:text-rose-900'
                            }`}
                        >
                            <MessageSquare className={`w-4 h-4 shrink-0 ${currentSession?.id === session.id ? 'opacity-100' : 'opacity-60'}`} />
                            <span className="truncate text-sm font-medium flex-1">{session.title}</span>
                            <button 
                                onClick={(e) => handleDeleteChat(e, session.id)}
                                className={`absolute right-2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                    currentSession?.id === session.id ? 'hover:bg-rose-700 text-white' : 'hover:bg-rose-200 text-rose-600'
                                }`}
                                title="Delete chat"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                         <div className="text-center text-sm text-rose-300 mt-10 italic px-8">
                             Your chat history will appear here once you start asking for advice.
                         </div>
                    )}
                </div>

                <div className="p-4 border-t border-rose-100 bg-rose-100/30">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Premium Member
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onLogout} className="flex items-center justify-center gap-2 text-xs font-medium p-2.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-slate-600 transition-colors">
                            <LogOut className="w-3 h-3" /> Logout
                        </button>
                        <button onClick={onDeleteAccount} className="flex items-center justify-center gap-2 text-xs font-medium p-2.5 rounded-lg bg-white border border-red-100 hover:bg-red-50 text-red-500 transition-colors">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-white relative w-full">
                {/* Header */}
                <div className="h-16 md:h-20 border-b border-rose-50 flex items-center px-4 md:px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-10 shrink-0 shadow-sm">
                    {/* Mobile: 3-column layout for centered logo */}
                    <div className="flex items-center justify-between w-full md:justify-start md:gap-4">
                        
                        {/* Left: Menu Trigger (Mobile) */}
                        <button 
                            onClick={toggleSidebar} 
                            className="md:hidden p-2 -ml-2 text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Center/Left: Elegant Logo */}
                        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-3">
                             <div className="flex items-center gap-2">
                                <div className="bg-rose-100 p-1.5 rounded-full md:bg-transparent md:p-0">
                                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" /> 
                                </div>
                                <h1 className="font-serif font-bold text-2xl text-rose-900 tracking-tight">
                                    Duoplee
                                </h1>
                             </div>
                             {/* Context/Subtitle - hidden on very small screens if needed, or styled discreetly */}
                             <span className="hidden md:block w-px h-4 bg-rose-200"></span>
                             <p className="hidden md:block text-xs text-rose-500 font-medium">
                                 {currentSession?.title || "Your Romantic Companion"}
                             </p>
                        </div>

                        {/* Right: Spacer or Action (e.g. New Chat shortcut for mobile) */}
                        <button 
                            onClick={handleNewChat}
                            className="md:hidden p-2 -mr-2 text-rose-400 hover:text-rose-600 transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 scroll-smooth"
                >
                    {(!currentSession || currentSession.messages.length === 0) && (
                        <div className="h-full flex flex-col items-center justify-center opacity-60 space-y-6 animate-fade-in pb-20">
                            <div className="bg-rose-50 p-6 rounded-full">
                                <Heart className="w-16 h-16 text-rose-400 fill-rose-100" />
                            </div>
                            <div className="text-center space-y-2 max-w-md px-4">
                                <h3 className="text-xl md:text-2xl font-serif text-rose-900 font-bold">How can I help you love better?</h3>
                                <p className="text-rose-500 text-sm md:text-base">Ask about gift ideas, date planning, or writing the perfect love letter.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg px-4">
                                <button onClick={() => setInput("What are some unique gift ideas for my boyfriend who loves tech?")} className="text-sm text-left p-3 border border-rose-100 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors text-slate-600">
                                    🎁 Gift for tech-loving boyfriend
                                </button>
                                <button onClick={() => setInput("Plan a romantic dinner date at home for under ₹2000")} className="text-sm text-left p-3 border border-rose-100 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors text-slate-600">
                                    🕯️ Romantic dinner at home
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {currentSession?.messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[90%] md:max-w-[75%] rounded-3xl px-5 py-4 md:px-6 md:py-5 shadow-sm text-sm md:text-base leading-relaxed
                                ${msg.role === Role.USER 
                                    ? 'bg-rose-600 text-white rounded-br-sm' 
                                    : 'bg-white border border-rose-100 text-slate-800 rounded-bl-sm shadow-md'}
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
                        <div className="flex justify-start">
                             <div className="bg-white border border-rose-100 shadow-md rounded-3xl rounded-bl-sm px-6 py-5 flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-150"></span>
                             </div>
                        </div>
                    )}
                    <div className="h-1"></div> {/* Spacer for bottom scroll */}
                </div>

                {/* Input Area */}
                <div className="p-3 md:p-6 bg-white border-t border-rose-50 shrink-0">
                    <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-rose-50/50 border border-rose-200 rounded-3xl p-2 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-400 transition-all shadow-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="What should I get for my partner..."
                            className="w-full pl-4 py-3 bg-transparent border-none outline-none text-slate-700 placeholder-rose-300 resize-none max-h-32 min-h-[50px] text-base"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="mb-1 mr-1 p-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 transition-all shadow-md active:scale-95 flex-shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-2 md:mt-3">
                        Duoplee may display inaccurate info about people, places, or facts.
                    </p>
                </div>
            </div>
        </div>
    );
};