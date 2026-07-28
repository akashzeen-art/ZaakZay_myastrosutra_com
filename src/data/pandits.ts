export type PanditKind = "real" | "bot";
export type PanditStatus = "available" | "busy";
export type PanditGender = "male" | "female";

export interface PanditProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  sessions: number;
  image: string;
  gender: PanditGender;
  kind: PanditKind;
  /** Only used for real pandits; bots are always busy. */
  baseAvailability: PanditStatus;
  featured?: boolean;
}

const imgM = (n: number) => `/pandit-profiles/pandit-m${String(n).padStart(2, "0")}.jpg`;
const imgF = (n: number) => `/pandit-profiles/pandit-f${String(n).padStart(2, "0")}.jpg`;

/** 15 real Gurus — availability can flip available/busy. */
export const REAL_PANDITS: PanditProfile[] = [
  {
    id: "real-01",
    name: "Dr. Pandit Shiv Tripathi Ji",
    title: "Vedic Acharya",
    specialty: "Kundli · Muhurat · Remedies",
    experienceYears: 28,
    rating: 4.9,
    sessions: 2300,
    image: imgM(1),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
    featured: true,
  },
  {
    id: "real-02",
    name: "Acharya Vishnu Shastri Ji",
    title: "Jyotish Shastri",
    specialty: "Marriage · Matching · Remedies",
    experienceYears: 22,
    rating: 4.8,
    sessions: 1840,
    image: imgM(2),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-03",
    name: "Dr. Acharya Priya Verma Ji",
    title: "Jyotishacharya",
    specialty: "Love · Marriage · Family",
    experienceYears: 18,
    rating: 4.8,
    sessions: 1620,
    image: imgF(1),
    gender: "female",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-04",
    name: "Dr. Pandit Ramesh Tripathi Ji",
    title: "Astro Consultant",
    specialty: "Career · Finance · Health",
    experienceYears: 19,
    rating: 4.7,
    sessions: 1560,
    image: imgM(3),
    gender: "male",
    kind: "real",
    baseAvailability: "busy",
  },
  {
    id: "real-05",
    name: "Pandit Mahesh Chandra Shastri Ji",
    title: "Vedic Scholar",
    specialty: "Kundli · Vastu · Muhurat",
    experienceYears: 31,
    rating: 4.9,
    sessions: 2710,
    image: imgM(4),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-06",
    name: "Guruma Kavita Tripathi Ji",
    title: "Vedic Astrologer",
    specialty: "Numerology · Destiny · Guidance",
    experienceYears: 16,
    rating: 4.7,
    sessions: 1180,
    image: imgF(2),
    gender: "female",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-07",
    name: "Dr. Acharya Surya Narayan Ji",
    title: "Palm & Numerology",
    specialty: "Palmistry · Numbers · Destiny",
    experienceYears: 17,
    rating: 4.6,
    sessions: 980,
    image: imgM(5),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-08",
    name: "Pandit Harishankar Dwivedi Ji",
    title: "Karmakand Expert",
    specialty: "Remedies · Puja · Graha Shanti",
    experienceYears: 25,
    rating: 4.8,
    sessions: 2010,
    image: imgM(6),
    gender: "male",
    kind: "real",
    baseAvailability: "busy",
  },
  {
    id: "real-09",
    name: "Dr. Anjali Mishra Ji",
    title: "Marriage Specialist",
    specialty: "Kundli Matching · Muhurat",
    experienceYears: 14,
    rating: 4.7,
    sessions: 940,
    image: imgF(3),
    gender: "female",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-10",
    name: "Dr. Pandit Anil Kumar Joshi Ji",
    title: "Vedic Astrologer",
    specialty: "Love · Marriage · Family",
    experienceYears: 16,
    rating: 4.7,
    sessions: 1120,
    image: imgM(7),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-11",
    name: "Acharya Brijesh Shastri Ji",
    title: "Jyotishacharya",
    specialty: "Birth Chart · Dasha · Transit",
    experienceYears: 21,
    rating: 4.8,
    sessions: 1675,
    image: imgM(8),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-12",
    name: "Guruma Meera Shastri Ji",
    title: "Spiritual Guide",
    specialty: "Remedies · Peace · Mantra",
    experienceYears: 20,
    rating: 4.8,
    sessions: 1350,
    image: imgF(4),
    gender: "female",
    kind: "real",
    baseAvailability: "busy",
  },
  {
    id: "real-13",
    name: "Pandit Gopal Krishna Mishra Ji",
    title: "Muhurat Specialist",
    specialty: "Muhurat · Sanskar · Rituals",
    experienceYears: 27,
    rating: 4.9,
    sessions: 2190,
    image: imgM(9),
    gender: "male",
    kind: "real",
    baseAvailability: "busy",
  },
  {
    id: "real-14",
    name: "Dr. Pandit Rajendra Prasad Ji",
    title: "Senior Astrologer",
    specialty: "Business · Career · Wealth",
    experienceYears: 24,
    rating: 4.7,
    sessions: 1430,
    image: imgM(10),
    gender: "male",
    kind: "real",
    baseAvailability: "available",
  },
  {
    id: "real-15",
    name: "Dr. Renuka Joshi Ji",
    title: "Family Astrologer",
    specialty: "Children · Education · Home",
    experienceYears: 15,
    rating: 4.6,
    sessions: 820,
    image: imgF(5),
    gender: "female",
    kind: "real",
    baseAvailability: "available",
  },
];

/** 15 bot Gurus — always busy in the UI. */
export const BOT_PANDITS: PanditProfile[] = [
  {
    id: "bot-01",
    name: "Pandit Satyanarayan Shastri Ji",
    title: "Vedic Reader",
    specialty: "General Guidance",
    experienceYears: 14,
    rating: 4.5,
    sessions: 640,
    image: imgM(11),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-02",
    name: "Acharya Suresh Chandra Ji",
    title: "Jyotish Guide",
    specialty: "Daily Predictions",
    experienceYears: 12,
    rating: 4.4,
    sessions: 520,
    image: imgM(12),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-03",
    name: "Guruma Sunita Dwivedi Ji",
    title: "Astro Advisor",
    specialty: "Love · Relationship",
    experienceYears: 13,
    rating: 4.6,
    sessions: 710,
    image: imgF(6),
    gender: "female",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-04",
    name: "Dr. Pandit Naveen Joshi Ji",
    title: "Temple Pandit",
    specialty: "Puja · Mantra",
    experienceYears: 16,
    rating: 4.5,
    sessions: 480,
    image: imgM(13),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-05",
    name: "Pandit Raghunath Shastri Ji",
    title: "Kundli Expert",
    specialty: "Birth Chart Reading",
    experienceYears: 13,
    rating: 4.4,
    sessions: 590,
    image: imgM(14),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-06",
    name: "Dr. Nandini Pathak Ji",
    title: "Numerology Guide",
    specialty: "Name · Numbers · Destiny",
    experienceYears: 11,
    rating: 4.5,
    sessions: 460,
    image: imgF(7),
    gender: "female",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-07",
    name: "Acharya Mohan Lal Ji",
    title: "Vedic Counselor",
    specialty: "Career Advice",
    experienceYears: 10,
    rating: 4.3,
    sessions: 410,
    image: imgM(15),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-08",
    name: "Pandit Dinesh Kumar Dubey Ji",
    title: "Astrology Mentor",
    specialty: "Health · Wellness",
    experienceYears: 15,
    rating: 4.5,
    sessions: 680,
    image: imgM(16),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-09",
    name: "Acharya Pooja Verma Ji",
    title: "Muhurat Guide",
    specialty: "Auspicious Timing",
    experienceYears: 12,
    rating: 4.6,
    sessions: 540,
    image: imgF(8),
    gender: "female",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-10",
    name: "Dr. Acharya Prem Shankar Ji",
    title: "Family Astrologer",
    specialty: "Marriage Matching",
    experienceYears: 14,
    rating: 4.5,
    sessions: 610,
    image: imgM(17),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-11",
    name: "Pandit Yashwant Shastri Ji",
    title: "Remedy Specialist",
    specialty: "Graha Shanti",
    experienceYears: 18,
    rating: 4.6,
    sessions: 730,
    image: imgM(18),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-12",
    name: "Dr. Acharya Swati Tiwari Ji",
    title: "Palm Reader",
    specialty: "Palmistry Insights",
    experienceYears: 11,
    rating: 4.5,
    sessions: 450,
    image: imgF(9),
    gender: "female",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-13",
    name: "Acharya Kamlesh Prasad Ji",
    title: "Spiritual Guide",
    specialty: "Peace · Meditation",
    experienceYears: 13,
    rating: 4.5,
    sessions: 570,
    image: imgM(19),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-14",
    name: "Dr. Acharya Manoj Tiwari Ji",
    title: "Vedic Scholar",
    specialty: "Scripture · Dharma",
    experienceYears: 17,
    rating: 4.6,
    sessions: 690,
    image: imgM(20),
    gender: "male",
    kind: "bot",
    baseAvailability: "busy",
  },
  {
    id: "bot-15",
    name: "Guruma Lakshmi Devi Ji",
    title: "Live Advisor",
    specialty: "Quick Consultation",
    experienceYears: 19,
    rating: 4.7,
    sessions: 880,
    image: imgF(10),
    gender: "female",
    kind: "bot",
    baseAvailability: "busy",
  },
];

export const ALL_PANDITS: PanditProfile[] = [...REAL_PANDITS, ...BOT_PANDITS];

export function shufflePandits<T>(list: T[], seed = Date.now()): T[] {
  const arr = [...list];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function resolvePanditStatus(
  pandit: PanditProfile,
  now = Date.now(),
): PanditStatus {
  if (pandit.kind === "bot") return "busy";

  const bucket = Math.floor(now / (5 * 60 * 1000));
  const flip = (hashString(pandit.id) + bucket) % 3 === 0;
  if (flip) {
    return pandit.baseAvailability === "available" ? "busy" : "available";
  }
  return pandit.baseAvailability;
}

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getShuffledRoster(now = Date.now()) {
  const seed = Math.floor(now / (5 * 60 * 1000));
  return shufflePandits(ALL_PANDITS, seed).map((pandit) => ({
    ...pandit,
    status: resolvePanditStatus(pandit, now),
  }));
}
