export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professional' | 'educator';
  isPremium: boolean;
  institution?: string;
  studyHistory: string[];
  avatar?: string;
}

export interface NoteVersion {
  id: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  title: string;
  content: string;
  changeSummary: string;
}

export interface NoteAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  content: string;
  subject: string;
  institution: string;
  tags: string[];
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  createdAt: string;
  fileType: 'pdf' | 'text';
  fileName: string;
  fileSize: string;
  isPremium: boolean;
  price?: number;
  qrCodeUrl?: string;
  rating: number;
  ratingsCount: number;
  views: number;
  downloads: number;
  versions: NoteVersion[];
  annotations: NoteAnnotation[];
  comments: Comment[];
  isCollaborative: boolean;
  activeCollaborators?: { name: string; color: string; x: number; y: number }[];
}

export interface CreatorAnalytics {
  totalViews: number;
  totalDownloads: number;
  averageRating: number;
  totalEarnings: number;
  platformSplit: number;
  monthlyChart: { month: string; earnings: number; downloads: number }[];
}
