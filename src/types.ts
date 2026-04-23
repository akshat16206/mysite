export interface PortfolioData {
  name: string;
  photoUrl: string;
  cvUrl?: string;
  education: string;
  description: string;
  experience: string;
  skills: string;
  email: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  topicId: string;
  author: string;
  createdAt: any;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  order: number;
}

export interface FunProject {
  id: string;
  title: string;
  description: string;
  externalLink: string;
  category: string;
  imageUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}