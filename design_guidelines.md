# Blockchain Loyalty Points Platform - Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from Web3 quest platforms (Galxe, Layer3), Duolingo's streak mechanics, and Telegram mini-apps' vibrant gamification. Creates an engaging, achievement-driven experience with crypto-native elements and Arabic-first design.

## Core Design Principles
1. **Gamification-First**: Points, streaks, and leaderboards drive every interaction
2. **Crypto Clarity**: Wallet status, balances, and blockchain actions always visible
3. **Achievement Celebration**: Visual rewards for completed tasks and milestones
4. **Bilingual Elegance**: Seamless Arabic/English support with proper RTL handling

---

## Typography System

**Font Families** (Google Fonts):
- Primary: Cairo (400, 600, 700) - Perfect Arabic/Latin support for UI and body text
- Accent: Space Grotesk (500, 700) - Numbers, stats, crypto addresses

**Type Scale**:
- Dashboard Stats: 4xl to 5xl (48-60px) for point totals
- Section Headers: 2xl to 3xl (32-48px)
- Task Cards: lg to xl (18-24px)
- Body Text: base (16px)
- Metadata: sm (14px)

**RTL Considerations**: All layouts mirror automatically, text-align switches, spacing reverses for Arabic mode.

---

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16
- Card padding: p-6, p-8
- Section spacing: py-12 (mobile), py-16 (desktop)
- Grid gaps: gap-4, gap-6
- Stat spacing: space-y-4

**Grid Patterns**:
- Dashboard: 3-column stats header (lg:grid-cols-3), 2-column main (sidebar + content)
- Leaderboard: Single column list with rank cards
- Tasks Grid: 2-column cards (md:grid-cols-2)
- Twitter Feed: Single column timeline

**Container Widths**:
- Dashboard: max-w-7xl
- Modals/Chatbot: max-w-2xl
- Content sections: max-w-6xl

---

## Component Library

### Navigation Header
- Logo + platform name (left/right based on locale)
- Wallet connection button (shows address when connected, "Connect BackPack" when not)
- Language toggle (AR/EN icon button)
- User points badge (prominent, always visible)
- Mobile: Bottom navigation bar (Home, Tasks, Leaderboard, Profile)

### Hero/Landing (60vh)
- Animated gradient background (purple-to-blue diagonal)
- Centered content: Bold headline, point reward callout, wallet connect CTA
- Floating 3D coin/crystal illustrations
- Trust metrics: "50K+ Users" + "2M Points Distributed"

### Dashboard (3-Section Layout)

**Stats Header** (3-column grid):
- Total Points Card: Large number display, sparkle icon, trend indicator
- Current Streak Card: Flame icon, days counter, progress ring
- Rank Card: Trophy icon, leaderboard position, "Top 5%" badge

**Main Area** (2-column):

*Left Sidebar*:
- Daily Quest Checklist: 
  - Daily login (checkmark/clock icon)
  - Twitter tasks (3-5 items with completion status)
  - Each task: Icon + title + points reward + action button
- Streak Calendar: 7-day visual grid showing completed days

*Right Content*:
- Activity Feed: Recent point earnings, completed tasks, level ups
- Achievement Showcase: Unlocked badges displayed as cards
- Next Milestone Progress Bar

### Leaderboard Page
- Top 3 Podium: Large cards with gradient backgrounds, user avatars, point totals
- Ranked List Below: User rank cards (position number, avatar, name, points, badge icons)
- Filter Tabs: Daily, Weekly, All-Time
- "Your Position" sticky card (highlighted, always visible when scrolling)

### Task Detail Cards
- Task Icon (category-based: Twitter bird, calendar, etc.)
- Title + description
- Point reward badge (prominent, top-right)
- Requirements checklist
- Action button: "Complete Task" or "Verify" or "Connected ✓"
- Progress indicator for multi-step tasks

### Smart Chatbot
- Floating bubble button (bottom-right, pulsing indicator when active)
- Chat panel: Slide-in from right/left (RTL aware)
- Message bubbles: User (gradient) vs Bot (neutral)
- Quick action chips below input
- Embedded wallet queries ("Check my balance", "Show tasks")

### Twitter Integration Panel
- Connected account display: Avatar + @handle + "Connected ✓" badge
- Recent tracked activities: Tweet cards with engagement metrics
- Points earned per activity
- "Refresh" button for new activity check

### Wallet Connection Modal
- BackPack logo + "Connect your wallet"
- Benefits list (secure, track points, redeem rewards)
- "Connect BackPack Wallet" primary button
- CARV SVM Testnet indicator badge
- Privacy assurance note

### Forms & Inputs
- Input fields: Rounded borders, gradient focus rings
- Buttons: Gradient backgrounds (purple-to-blue), white text
- Buttons on images: Backdrop blur background, white/light text
- Success states: Confetti animation + point increment counter

---

## Icons
**Library**: Heroicons (via CDN)
- Wallet, Key for crypto actions
- Fire, Trophy, Star for gamification
- CheckCircle, Clock for task status
- ChatBubble for chatbot
- Twitter logo (custom SVG: <!-- CUSTOM ICON: Twitter bird -->)
- ChevronRight/Left for carousels and navigation

---

## Images

**Hero Section**:
- Animated gradient background (purple #8B5CF6 to blue #3B82F6)
- Floating 3D elements: Cryptocurrency coins, crystals, point particles (use illustration libraries or placeholders)
- No photographic hero - pure gradient + geometric elements

**Dashboard Illustrations**:
- Achievement badges: Trophy, crown, star medal icons (colorful, reward-style)
- Empty states: Friendly illustrations for "No tasks yet", "Join leaderboard"

**User Avatars**:
- Circular crops, 48px-64px
- Default gradient avatars for users without photos
- Rank badges overlay (top-right corner)

**Chatbot Avatar**:
- Friendly AI robot icon, gradient-filled, 40px circle

---

## Gamification Visual Language

**Point Animations**:
- Number increment on task completion
- Floating "+50 points" text fade-up
- Coin spin animation on rewards

**Streak Visuals**:
- Flame icon intensity increases with streak length
- Calendar day tiles: Gray (incomplete), gradient (complete), gold (today)

**Progress Rings/Bars**:
- Gradient fills (purple-to-blue)
- Smooth transitions on progress updates
- Percentage labels inside rings

**Rank Badges**:
- Bronze/Silver/Gold/Diamond visual tiers
- Glow effects on higher ranks

---

## Interactions (Purposeful Only)

**Essential Animations**:
- Point counter increment on earn
- Streak flame pulse on daily login
- Task completion checkmark fill
- Confetti burst on level up
- Wallet connect success fade-in

**No Animation**:
- Page transitions
- Background gradients (static)
- Scroll effects
- Leaderboard ranking changes

---

## Accessibility
- Minimum touch targets: 44x44px
- Wallet address truncation with copy button
- Keyboard navigation for task lists
- ARIA labels for all icon buttons
- Screen reader announcements for point changes
- High contrast mode support
- RTL mirroring handled by dir="rtl" attribute

---

This gamified Web3 platform balances playful engagement mechanics with crypto-native clarity, supporting Arabic users while maintaining modern visual appeal through gradients and achievement-driven design.