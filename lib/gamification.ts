// ─── Gamification Data Layer ───────────────────────────────────────────────

export const levelNames = [
  'Newcomer',       // 1
  'Observer',       // 2
  'Practitioner',   // 3
  'Contributor',    // 4
  'Specialist',     // 5
  'Expert',         // 6
  'Senior Expert',  // 7  ← Sarah
  'Lead',           // 8
  'Master',         // 9
  'Compliance Pro', // 10
]

export const xpPerLevel = [0, 500, 1200, 2000, 3000, 4200, 5600, 7200, 9000, 11000]

export const userProfile = {
  id: 'usr_001',
  name: 'Sarah Mitchell',
  role: 'Compliance Manager',
  avatar: 'SM',
  level: 7,
  levelName: 'Senior Expert',
  xp: 3240,
  xpThisLevel: 3240 - 2000, // XP earned within this level (since level 7 starts at 2000 from level-relative baseline)
  xpToNextLevel: 4000,       // XP needed to reach level 8
  totalXp: 18450,
  totalPoints: 18450,
  streak: 14,                // current days streak
  longestStreak: 21,
  rank: 2,
  totalTeamMembers: 8,
  joinedDate: '2024-03-15',
  completedTasks: 89,
  documentsUploaded: 23,
  inspectionsCompleted: 12,
  reportsGenerated: 5,
}

export type AchievementCategory = 'tasks' | 'safety' | 'documents' | 'streak' | 'compliance' | 'inspections'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  points: number
  earned: boolean
  earnedDate?: string
  rarity: AchievementRarity
  progress?: number   // 0-100 for locked ones
}

export const achievements: Achievement[] = [
  // ── Tasks ─────────────────────────────────────────────────────────────────
  { id: 'first-task',  title: 'First Step',        description: 'Complete your first task',      icon: '🎯', category: 'tasks',       points: 50,   earned: true,  earnedDate: '2025-01-10', rarity: 'common'    },
  { id: 'task-10',     title: 'Getting Things Done',description: 'Complete 10 tasks',             icon: '✅', category: 'tasks',       points: 150,  earned: true,  earnedDate: '2025-01-28', rarity: 'common'    },
  { id: 'task-50',     title: 'Task Crusher',       description: 'Complete 50 tasks',             icon: '⚡', category: 'tasks',       points: 500,  earned: true,  earnedDate: '2025-03-12', rarity: 'rare'      },
  { id: 'task-100',    title: 'Century Club',       description: 'Complete 100 tasks',            icon: '💯', category: 'tasks',       points: 1000, earned: false, rarity: 'epic',     progress: 89  },
  { id: 'zero-overdue',title: 'Zero Tolerance',     description: 'No overdue tasks for 30 days',  icon: '🛡️', category: 'tasks',       points: 750,  earned: false, rarity: 'epic',     progress: 40  },
  { id: 'speed-runner',title: 'Speed Runner',       description: 'Complete 5 tasks in one day',   icon: '🏃', category: 'tasks',       points: 300,  earned: false, rarity: 'rare',     progress: 20  },

  // ── Streaks ────────────────────────────────────────────────────────────────
  { id: 'streak-3',    title: 'Consistent',         description: 'Log in 3 days in a row',        icon: '🔥', category: 'streak',      points: 75,   earned: true,  earnedDate: '2025-01-12', rarity: 'common'    },
  { id: 'streak-7',    title: 'Week Warrior',        description: '7-day login streak',            icon: '💫', category: 'streak',      points: 200,  earned: true,  earnedDate: '2025-01-18', rarity: 'rare'      },
  { id: 'streak-14',   title: 'Fortnight Focus',     description: '14-day login streak',           icon: '🌟', category: 'streak',      points: 400,  earned: true,  earnedDate: '2025-03-20', rarity: 'rare'      },
  { id: 'streak-30',   title: 'Iron Will',           description: '30-day login streak',           icon: '🏆', category: 'streak',      points: 1000, earned: false, rarity: 'legendary', progress: 47 },
  { id: 'streak-100',  title: 'Unbreakable',         description: '100-day login streak',          icon: '⚔️', category: 'streak',      points: 5000, earned: false, rarity: 'legendary', progress: 14 },

  // ── Safety ─────────────────────────────────────────────────────────────────
  { id: 'first-incident', title: 'Safety First',    description: 'Report your first incident',    icon: '🦺', category: 'safety',      points: 100,  earned: true,  earnedDate: '2025-02-01', rarity: 'common'    },
  { id: 'perfect-inspection', title: 'Perfect Score',description: 'Get 100% on an inspection',   icon: '⭐', category: 'safety',      points: 300,  earned: true,  earnedDate: '2025-02-14', rarity: 'rare'      },
  { id: 'hazard-hunter', title: 'Hazard Hunter',    description: 'Log 5 workplace hazards',       icon: '🔍', category: 'safety',      points: 200,  earned: false, rarity: 'rare',     progress: 60  },
  { id: 'swms-master', title: 'SWMS Master',         description: 'All workers sign a SWMS',      icon: '📋', category: 'safety',      points: 350,  earned: false, rarity: 'epic',     progress: 75  },
  { id: 'near-miss-reporter', title: 'Eyes Open',   description: 'Report 3 near misses',          icon: '👁️', category: 'safety',      points: 250,  earned: false, rarity: 'rare',     progress: 33  },

  // ── Documents ──────────────────────────────────────────────────────────────
  { id: 'first-doc',   title: 'Paper Trail',         description: 'Upload your first document',   icon: '📄', category: 'documents',   points: 50,   earned: true,  earnedDate: '2025-01-10', rarity: 'common'    },
  { id: 'doc-10',      title: 'Organised',           description: 'Upload 10 documents',          icon: '🗂️', category: 'documents',   points: 250,  earned: true,  earnedDate: '2025-02-05', rarity: 'rare'      },
  { id: 'doc-50',      title: 'Filing Cabinet',      description: 'Upload 50 documents',          icon: '🏛️', category: 'documents',   points: 750,  earned: false, rarity: 'epic',     progress: 46  },
  { id: 'doc-verified',title: 'Fully Verified',      description: 'Verify 5 contractor documents',icon: '✔️', category: 'documents',   points: 300,  earned: false, rarity: 'rare',     progress: 80  },

  // ── Compliance ─────────────────────────────────────────────────────────────
  { id: 'score-80',    title: 'Above Average',       description: 'Reach a compliance score of 80', icon: '📈', category: 'compliance', points: 500,  earned: true,  earnedDate: '2025-03-01', rarity: 'rare'      },
  { id: 'score-90',    title: 'High Achiever',       description: 'Reach a compliance score of 90', icon: '🥇', category: 'compliance', points: 1000, earned: false, rarity: 'epic',     progress: 91  },
  { id: 'score-100',   title: 'Perfect Compliance',  description: 'Reach a compliance score of 100',icon: '👑', category: 'compliance', points: 5000, earned: false, rarity: 'legendary', progress: 82 },
  { id: 'audit-ready', title: 'Audit Ready',         description: 'Hit 95% audit readiness',      icon: '🏅', category: 'compliance', points: 2000, earned: false, rarity: 'legendary', progress: 65 },

  // ── Inspections ────────────────────────────────────────────────────────────
  { id: 'first-inspection', title: 'Inspector',     description: 'Complete your first inspection',icon: '🔎', category: 'inspections', points: 100,  earned: true,  earnedDate: '2025-01-20', rarity: 'common'    },
  { id: 'inspection-5', title: 'Site Checker',      description: 'Complete 5 inspections',        icon: '🏗️', category: 'inspections', points: 300,  earned: true,  earnedDate: '2025-03-08', rarity: 'rare'      },
  { id: 'inspection-10', title: 'Seasoned Inspector',description: 'Complete 10 inspections',      icon: '🏅', category: 'inspections', points: 500,  earned: false, rarity: 'epic',     progress: 120 / 100 },
]

// ── Leaderboard ─────────────────────────────────────────────────────────────

export type LeaderboardEntry = {
  rank: number
  name: string
  role: string
  xp: number
  level: number
  levelName: string
  streak: number
  avatar: string
  trend: 'up' | 'down' | 'same'
  isCurrentUser: boolean
  completedThisMonth: number
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Marcus Chen',     role: 'Site Supervisor',      xp: 5200, level: 9,  levelName: 'Master',      streak: 28, avatar: 'MC', trend: 'up',   isCurrentUser: false, completedThisMonth: 34 },
  { rank: 2, name: 'Sarah Mitchell',  role: 'Compliance Manager',   xp: 3240, level: 7,  levelName: 'Senior Expert',streak: 14, avatar: 'SM', trend: 'same', isCurrentUser: true,  completedThisMonth: 21 },
  { rank: 3, name: 'Jordan Lee',      role: 'HSE Advisor',          xp: 2980, level: 6,  levelName: 'Expert',      streak: 9,  avatar: 'JL', trend: 'up',   isCurrentUser: false, completedThisMonth: 18 },
  { rank: 4, name: 'Aisha Patel',     role: 'Site Manager',         xp: 2150, level: 5,  levelName: 'Specialist',  streak: 5,  avatar: 'AP', trend: 'down', isCurrentUser: false, completedThisMonth: 15 },
  { rank: 5, name: 'Tom Nguyen',      role: 'Foreman',              xp: 1840, level: 4,  levelName: 'Contributor', streak: 3,  avatar: 'TN', trend: 'up',   isCurrentUser: false, completedThisMonth: 12 },
  { rank: 6, name: 'Emma Walsh',      role: 'Administrator',        xp: 1620, level: 4,  levelName: 'Contributor', streak: 0,  avatar: 'EW', trend: 'down', isCurrentUser: false, completedThisMonth: 9  },
  { rank: 7, name: 'David Park',      role: 'Project Manager',      xp: 980,  level: 3,  levelName: 'Practitioner',streak: 1,  avatar: 'DP', trend: 'same', isCurrentUser: false, completedThisMonth: 6  },
  { rank: 8, name: 'Lily Brown',      role: 'Safety Officer',       xp: 540,  level: 2,  levelName: 'Observer',    streak: 0,  avatar: 'LB', trend: 'up',   isCurrentUser: false, completedThisMonth: 3  },
]

// ── Daily Challenges ─────────────────────────────────────────────────────────

export type DailyChallenge = {
  id: string
  title: string
  description: string
  reward: number
  progress: number
  total: number
  completed: boolean
  icon: string
  category: AchievementCategory
}

export const dailyChallenges: DailyChallenge[] = [
  { id: 'dc1', title: 'Task Champion',   description: 'Complete 3 tasks today',           reward: 75,  progress: 2, total: 3, completed: false, icon: '✅', category: 'tasks'       },
  { id: 'dc2', title: 'Safety Aware',    description: 'Review 1 SWMS document',           reward: 50,  progress: 1, total: 1, completed: true,  icon: '🦺', category: 'safety'      },
  { id: 'dc3', title: 'Document Day',    description: 'Upload or verify a document',      reward: 50,  progress: 0, total: 1, completed: false, icon: '📄', category: 'documents'   },
]

// ── Task XP Rewards ──────────────────────────────────────────────────────────

export const taskXP: Record<string, number> = {
  // by priority
  high:   30,
  medium: 20,
  low:    10,
  // bonus by status
  overdue_bonus: 15,
  due_today_bonus: 5,
}

// ── Recent XP Activity ────────────────────────────────────────────────────────

export type XPActivity = {
  type: 'achievement' | 'task' | 'levelup' | 'challenge' | 'inspection' | 'document'
  message: string
  points: number
  time: string
}

export const recentXPActivity: XPActivity[] = [
  { type: 'achievement', message: 'Earned "Fortnight Focus" badge',              points: 400, time: '2h ago'    },
  { type: 'task',        message: 'Completed "Review contractor insurance docs"', points: 30,  time: '3h ago'    },
  { type: 'challenge',   message: 'Daily challenge "Safety Aware" complete',      points: 50,  time: 'Yesterday' },
  { type: 'inspection',  message: 'Completed Site B monthly inspection',           points: 40,  time: '2 days ago'},
  { type: 'task',        message: 'Completed "Submit induction records"',          points: 20,  time: '2 days ago'},
  { type: 'levelup',     message: 'Levelled up to Level 7 — Senior Expert!',      points: 0,   time: '3 days ago'},
]

// ── Monthly XP Trend ─────────────────────────────────────────────────────────

export const xpHistory = [
  { month: 'Nov', xp: 380 },
  { month: 'Dec', xp: 520 },
  { month: 'Jan', xp: 680 },
  { month: 'Feb', xp: 890 },
  { month: 'Mar', xp: 760 },
  { month: 'Apr', xp: 1010 },
]
