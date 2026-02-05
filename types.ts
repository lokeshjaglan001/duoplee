export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

export enum ViewState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  PAYMENT = 'PAYMENT',
  CHAT = 'CHAT'
}

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}