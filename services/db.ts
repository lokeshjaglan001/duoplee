import { User, ChatSession } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'duoplee_current_user',
  USERS: 'duoplee_users',
  CHATS: 'duoplee_chats'
};

// User Management
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
}

export function registerUser(email: string, name: string, password: string): User {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error("Email already registered");
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    isPremium: false,
    createdAt: Date.now()
  };

  // Store password separately (in production, use proper encryption)
  const passwords = JSON.parse(localStorage.getItem('duoplee_passwords') || '{}');
  passwords[email] = password;
  localStorage.setItem('duoplee_passwords', JSON.stringify(passwords));

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  
  return newUser;
}

export function loginUser(email: string, password: string): User {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error("User not found");
  }

  // Verify password
  const passwords = JSON.parse(localStorage.getItem('duoplee_passwords') || '{}');
  if (passwords[email] !== password) {
    throw new Error("Invalid password");
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function upgradeUserToPremium(userId: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex >= 0) {
    users[userIndex].isPremium = true;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
  }
}

export function deleteAccount(userId: string): void {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
  
  // Delete user's chats
  const allChats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '{}');
  delete allChats[userId];
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
  
  // Delete user's password
  const passwords = JSON.parse(localStorage.getItem('duoplee_passwords') || '{}');
  const user = users.find(u => u.id === userId);
  if (user) {
    delete passwords[user.email];
    localStorage.setItem('duoplee_passwords', JSON.stringify(passwords));
  }
  
  logoutUser();
}

function getAllUsers(): User[] {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersStr ? JSON.parse(usersStr) : [];
}

// Chat Management
export function getUserChats(userId: string): ChatSession[] {
  const allChats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '{}');
  const userChats = allChats[userId] || [];
  return userChats.sort((a: ChatSession, b: ChatSession) => b.lastUpdated - a.lastUpdated);
}

export function createNewSession(): ChatSession {
  return {
    id: Date.now().toString(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };
}

export function saveChat(userId: string, session: ChatSession): void {
  const allChats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '{}');
  
  if (!allChats[userId]) {
    allChats[userId] = [];
  }
  
  const sessionIndex = allChats[userId].findIndex((s: ChatSession) => s.id === session.id);
  
  if (sessionIndex >= 0) {
    allChats[userId][sessionIndex] = session;
  } else {
    allChats[userId].unshift(session);
  }
  
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
}

export function deleteChatSession(userId: string, sessionId: string): void {
  const allChats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '{}');
  
  if (allChats[userId]) {
    allChats[userId] = allChats[userId].filter((s: ChatSession) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
  }
}