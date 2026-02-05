import { User, ChatSession } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'duoplee_current_user',
  USERS: 'duoplee_users',
  CHATS_PREFIX: 'duoplee_chats_'
};

// User Management
export function registerUser(email: string, name: string, password: string): User {
  const users = getAllUsers();
  
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    isPremium: false
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  
  // Store password separately (in production, use proper encryption)
  localStorage.setItem(`duoplee_pwd_${newUser.id}`, password);
  
  return newUser;
}

export function loginUser(email: string, password: string): User {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const storedPassword = localStorage.getItem(`duoplee_pwd_${user.id}`);
  if (storedPassword !== password) {
    throw new Error('Invalid email or password');
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function upgradeUserToPremium(userId: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].isPremium = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
  }
}

export function deleteAccount(userId: string): void {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(`duoplee_pwd_${userId}`);
  localStorage.removeItem(`${STORAGE_KEYS.CHATS_PREFIX}${userId}`);
}

function getAllUsers(): User[] {
  const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersData ? JSON.parse(usersData) : [];
}

// Chat Management
export function getUserChats(userId: string): ChatSession[] {
  const chatsData = localStorage.getItem(`${STORAGE_KEYS.CHATS_PREFIX}${userId}`);
  return chatsData ? JSON.parse(chatsData) : [];
}

export function saveChat(userId: string, session: ChatSession): void {
  const chats = getUserChats(userId);
  const existingIndex = chats.findIndex(c => c.id === session.id);
  
  if (existingIndex !== -1) {
    chats[existingIndex] = session;
  } else {
    chats.unshift(session);
  }
  
  localStorage.setItem(`${STORAGE_KEYS.CHATS_PREFIX}${userId}`, JSON.stringify(chats));
}

export function deleteChatSession(userId: string, sessionId: string): void {
  const chats = getUserChats(userId);
  const filteredChats = chats.filter(c => c.id !== sessionId);
  localStorage.setItem(`${STORAGE_KEYS.CHATS_PREFIX}${userId}`, JSON.stringify(filteredChats));
}

export function createNewSession(): ChatSession {
  return {
    id: Date.now().toString(),
    title: 'New Conversation',
    messages: [],
    lastUpdated: Date.now()
  };
}