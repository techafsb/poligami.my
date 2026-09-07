import type {
  ChatMessage,
  FeedPost,
  OnboardingStep,
  PendingSignup,
  Profile,
  StoredUser,
} from "./types";

const DB_KEY = "poligami.v1";
const SESSION_KEY = "poligami.session";

type DbShape = {
  users: Record<string, StoredUser>;
  pending: Record<string, PendingSignup>;
  likes: { fromId: string; toId: string }[];
  posts: FeedPost[];
  messages: ChatMessage[];
};

const emptyDb = (): DbShape => ({
  users: {},
  pending: {},
  likes: [],
  posts: [],
  messages: [],
});

function read(): DbShape {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return emptyDb();
    return { ...emptyDb(), ...JSON.parse(raw) };
  } catch {
    return emptyDb();
  }
}

function write(db: DbShape) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function apiUrl(path: string) {
  const base = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return `${base}${path}`;
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`poligami.my:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function uid() {
  return crypto.randomUUID();
}

function publicProfile(u: StoredUser): Profile {
  const { passwordHash: _, ...rest } = u;
  return { ...rest, bio: rest.bio || "" };
}

export function getSession(): { userId: string; email: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(userId: string, email: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, email }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getPending(email: string) {
  return read().pending[email.toLowerCase()] ?? null;
}

export async function startRegistration(input: {
  fullName: string;
  email: string;
  phone: string;
}): Promise<{ email: string; emailSent: boolean; devToken?: string }> {
  const email = input.email.trim().toLowerCase();
  const db = read();
  if (Object.values(db.users).some((u) => u.email === email)) {
    throw new Error("E-mel ini sudah didaftarkan. Sila log masuk.");
  }

  const token = uid();
  db.pending[email] = {
    email,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    token,
    verified: false,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  write(db);

  let emailSent = false;
  try {
    const res = await fetch(apiUrl("/api/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, email, token }),
    });
    if (res.ok) {
      const data = await res.json();
      emailSent = Boolean(data.emailSent);
    }
  } catch {
    /* local / APK without API */
  }

  return { email, emailSent, devToken: emailSent ? undefined : token };
}

export function verifyToken(token: string) {
  const db = read();
  const pending = Object.values(db.pending).find((p) => p.token === token);
  if (!pending) throw new Error("Pautan tidak sah.");
  if (pending.expiresAt < Date.now()) throw new Error("Pautan telah tamat tempoh.");
  pending.verified = true;
  db.pending[pending.email] = pending;
  write(db);
  return pending;
}

export function isEmailVerified(email: string) {
  return Boolean(read().pending[email.toLowerCase()]?.verified);
}

export async function createAccountFromPending(input: {
  email: string;
  displayName: string;
  age: number;
  occupation: string;
  password: string;
  photoUrl: string | null;
}) {
  const email = input.email.toLowerCase();
  const db = read();
  const pending = db.pending[email];
  if (!pending?.verified) throw new Error("Sila sahkan e-mel dahulu.");

  const id = uid();
  const user: StoredUser = {
    id,
    email,
    fullName: pending.fullName,
    displayName: input.displayName.trim(),
    phone: pending.phone,
    age: input.age,
    occupation: input.occupation.trim(),
    bio: "",
    photoUrl: input.photoUrl,
    role: "",
    marriageDuration: "Belum berkahwin",
    childrenCount: "0",
    state: "Selangor",
    partnerInformed: false,
    consulted: false,
    checklistDone: [
      [false, false, false],
      [false, false, false, false],
      [false, false, false],
      [false, false, false],
    ],
    mykadFront: null,
    mykadBack: null,
    onboardingComplete: false,
    onboardingStep: "role-status",
    createdAt: new Date().toISOString(),
    passwordHash: await hashPassword(input.password),
  };
  db.users[id] = user;
  delete db.pending[email];
  write(db);
  setSession(id, email);
  return publicProfile(user);
}

export function getUser(id: string) {
  const u = read().users[id];
  return u ? publicProfile(u) : null;
}

export function getUserByEmail(email: string) {
  const u = Object.values(read().users).find((x) => x.email === email.toLowerCase());
  return u ? publicProfile(u) : null;
}

export function updateUser(id: string, patch: Partial<Profile>) {
  const db = read();
  const u = db.users[id];
  if (!u) throw new Error("Akaun tidak dijumpai.");
  db.users[id] = { ...u, ...patch };
  write(db);
  return publicProfile(db.users[id]);
}

export async function signIn(email: string, password: string) {
  const db = read();
  const user = Object.values(db.users).find((u) => u.email === email.trim().toLowerCase());
  if (!user) throw new Error("E-mel atau kata laluan tidak sah.");
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error("E-mel atau kata laluan tidak sah.");
  if (!user.onboardingComplete) {
    setSession(user.id, user.email);
    return publicProfile(user);
  }
  setSession(user.id, user.email);
  return publicProfile(user);
}

export function signOut() {
  clearSession();
}

export function listExplore(meId: string) {
  const db = read();
  const liked = new Set(db.likes.filter((l) => l.fromId === meId).map((l) => l.toId));
  return Object.values(db.users)
    .filter((u) => u.id !== meId && u.onboardingComplete && !liked.has(u.id))
    .map(publicProfile);
}

export function likeUser(fromId: string, toId: string) {
  const db = read();
  if (!db.likes.some((l) => l.fromId === fromId && l.toId === toId)) {
    db.likes.push({ fromId, toId });
    write(db);
  }
  const mutual = db.likes.some((l) => l.fromId === toId && l.toId === fromId);
  return { matched: mutual };
}

export function listMatches(meId: string) {
  const db = read();
  const iLiked = db.likes.filter((l) => l.fromId === meId).map((l) => l.toId);
  const theyLiked = new Set(db.likes.filter((l) => l.toId === meId).map((l) => l.fromId));
  return iLiked
    .filter((id) => theyLiked.has(id))
    .map((id) => db.users[id])
    .filter(Boolean)
    .map(publicProfile);
}

export function conversationId(a: string, b: string) {
  return [a, b].sort().join(":");
}

export function listMessages(meId: string, otherId: string) {
  const cid = conversationId(meId, otherId);
  return read()
    .messages.filter((m) => m.conversationId === cid)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function sendMessage(meId: string, otherId: string, text: string) {
  const db = read();
  const msg: ChatMessage = {
    id: uid(),
    conversationId: conversationId(meId, otherId),
    fromId: meId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  db.messages.push(msg);
  write(db);
  return msg;
}

export function listPosts(meId: string) {
  const matches = new Set(listMatches(meId).map((p) => p.id));
  matches.add(meId);
  return read()
    .posts.filter((p) => matches.has(p.authorId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPost(author: Profile, input: { text: string; mediaUrl: string | null; mediaType: "image" | "video" | null }) {
  const db = read();
  const post: FeedPost = {
    id: uid(),
    authorId: author.id,
    authorName: author.displayName,
    authorPhoto: author.photoUrl,
    text: input.text.trim(),
    mediaUrl: input.mediaUrl,
    mediaType: input.mediaType,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
  };
  db.posts.unshift(post);
  write(db);
  return post;
}

export function togglePostLike(postId: string, userId: string) {
  const db = read();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return null;
  const i = post.likedBy.indexOf(userId);
  if (i >= 0) {
    post.likedBy.splice(i, 1);
  } else {
    post.likedBy.push(userId);
  }
  post.likes = post.likedBy.length;
  write(db);
  return post;
}

export function lastMessage(meId: string, otherId: string) {
  const msgs = listMessages(meId, otherId);
  return msgs[msgs.length - 1] ?? null;
}

export function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "Baru sahaja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gagal membaca fail."));
    reader.readAsDataURL(file);
  });
}

export function nextOnboardingScreen(step: OnboardingStep): OnboardingStep | "feed" {
  const order: OnboardingStep[] = [
    "create-profile",
    "role-status",
    "current-marriage",
    "select-state",
    "legal-checklist",
    "identity-verification",
    "upload-documents",
    "complete",
  ];
  const i = order.indexOf(step);
  return order[i + 1] ?? "feed";
}
