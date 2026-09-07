export type OnboardingStep =
  | "create-profile"
  | "role-status"
  | "current-marriage"
  | "select-state"
  | "legal-checklist"
  | "identity-verification"
  | "upload-documents"
  | "complete";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  displayName: string;
  phone: string;
  age: number | null;
  occupation: string;
  bio: string;
  photoUrl: string | null;
  role: string;
  marriageDuration: string;
  childrenCount: string;
  state: string;
  partnerInformed: boolean;
  consulted: boolean;
  checklistDone: boolean[][];
  mykadFront: string | null;
  mykadBack: string | null;
  onboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  createdAt: string;
};

export type PendingSignup = {
  email: string;
  fullName: string;
  phone: string;
  token: string;
  verified: boolean;
  expiresAt: number;
};

export type StoredUser = Profile & {
  passwordHash: string;
};

export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  text: string;
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  createdAt: string;
  likes: number;
  likedBy: string[];
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  fromId: string;
  text: string;
  createdAt: string;
};

export const MALAYSIAN_STATES = [
  "Selangor",
  "Wilayah Persekutuan",
  "Johor",
  "Pulau Pinang",
  "Perak",
  "Negeri Sembilan",
  "Pahang",
  "Terengganu",
  "Kelantan",
  "Kedah",
  "Perlis",
  "Sabah",
  "Sarawak",
] as const;

export const CHAT_SUGGESTIONS = [
  "Hi!",
  "Assalamualaikum",
  "Apa khabar?",
  "Boleh kita berkenalan dengan tertib?",
  "Terima kasih kerana match.",
];
