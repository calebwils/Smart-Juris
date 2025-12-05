export enum UserRole {
  ADMIN = 'Administrateur',
  LAWYER = 'Avocat',
  ASSISTANT = 'Assistant',
  STUDENT = 'Étudiant',
}

export enum CaseStatus {
  OPEN = 'Ouvert',
  PENDING = 'En attente',
  CLOSED = 'Clôturé',
  ARCHIVED = 'Archivé',
}

export enum SubscriptionPlan {
  FREE = 'Gratuit',
  PREMIUM = 'Premium',
  ENTERPRISE = 'Entreprise',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subscription: SubscriptionPlan;
}

export interface CaseFile {
  id: string;
  clientName: string;
  title: string;
  description: string;
  status: CaseStatus;
  dateCreated: string;
  dateUpdated: string;
  notes: string[];
  documents: { name: string; type: string; url?: string }[];
  aiResponses: { query: string; response: string; date: string }[];
}

export interface LegalDocument {
  id: string;
  title: string;
  category: 'Code' | 'Loi' | 'Décret' | 'Jurisprudence';
  content: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  relatedLinkId?: string;
}

export type Language = 'fr' | 'en';