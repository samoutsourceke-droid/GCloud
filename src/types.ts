export interface Socials {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

export interface Lead {
  id: string; // unique local ID
  businessName: string;
  niche: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp: string;
  socials: Socials;
  currentPaintPoints: string;
  relevanceScore: number;
  createdAt: string;
  followUpStatus: "Not Contacted" | "Contacted" | "Pitched" | "Followed Up" | "Woned" | "Lost";
  customNotes?: string;
  sourcePlatform?: string;
  urgencyLevel?: "Critical" | "High" | "Medium" | "Low";
  willingnessToPay?: "Premium Value" | "High" | "Standard" | "Budget";
  likelyConversionRate?: number;
  demandSignalSource?: string;
}

export interface Pitch {
  id: string;
  leadId: string;
  medium: "Email" | "WhatsApp" | "LinkedIn" | "Custom";
  content: string;
  followUpDay: number; // 0 for initial, 1 for Day 1, 3 for Day 3, etc.
  createdAt: string;
  sentAt?: string;
  status: "draft" | "sent";
}

export interface AuditRecommendation {
  title: string;
  actionableDetail: string;
}

export interface BusinessAudit {
  id: string;
  companyName: string;
  website: string;
  coreActivity: string;
  challenge: string;
  scoreBreakdown: {
    marketing: number;
    presence: number;
    operations: number;
    retention: number;
  };
  executiveSummary: string;
  criticalGap: string;
  recommendations: AuditRecommendation[];
  growthLiftEstimate: string;
  pitchHookIdea: string;
  createdAt: string;
}

export interface UserBusinessProfile {
  companyName: string;
  website: string;
  services: string;
  contactName: string;
  bio: string;
  tone: string;
}

