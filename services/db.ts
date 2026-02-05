import { User, ChatSession, Message, Role } from "../types";

const STORAGE_KEYS = {
  USER: 'duoplee_user_session',
  USERS_DB: 'duoplee_users_db',
  CHATS: 'duoplee_chats_',
};

// --- User Management ---

export const registerUser = (email: string, name: string, password: string): User => {
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  if (users[email]) {
    throw new Error("User already exists.");
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    isPremium: false,
    createdAt: Date.now(),
  };

  users[email] = { ...newUser, password }; // Store simple mock password
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  
  const user = users[email];
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    isPremium: user.isPremium,
    createdAt: user.createdAt
  };

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
  return sessionUser;
};

export const getCurrentUser = (): User | null => {
  const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
  return userRaw ? JSON.parse(userRaw) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const upgradeUserToPremium = (userId: string) => {
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  
  // Find key by id (inefficient but fine for mock)
  const email = Object.keys(users).find(key => users[key].id === userId);
  
  if (email) {
    users[email].isPremium = true;
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    
    // Update current session
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.isPremium = true;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }
};

export const deleteAccount = (userId: string) => {
  const usersRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  const users = usersRaw ? JSON.parse(usersRaw) : {};
  const email = Object.keys(users).find(key => users[key].id === userId);

  if (email) {
    delete users[email];
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CHATS + userId);
  }
};

// --- Chat Management ---

export const getUserChats = (userId: string): ChatSession[] => {
  const chatsRaw = localStorage.getItem(STORAGE_KEYS.CHATS + userId);
  return chatsRaw ? JSON.parse(chatsRaw) : [];
};

export const saveChat = (userId: string, session: ChatSession) => {
  const chats = getUserChats(userId);
  const existingIndex = chats.findIndex(c => c.id === session.id);
  
  if (existingIndex >= 0) {
    chats[existingIndex] = session;
  } else {
    chats.unshift(session);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHATS + userId, JSON.stringify(chats));
};

export const createNewSession = (): ChatSession => {
  return {
    id: Date.now().toString(),
    title: 'New Conversation',
    messages: [],
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };
};

export const deleteChatSession = (userId: string, sessionId: string) => {
    let chats = getUserChats(userId);
    chats = chats.filter(c => c.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.CHATS + userId, JSON.stringify(chats));
};