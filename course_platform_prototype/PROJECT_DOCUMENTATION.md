# 🎨 DESIGN REPLICATION INSTRUCTIONS

> **IMPORTANT**: The screen HTML files are located in the `screens/` folder within this exported ZIP file. You MUST replicate the designs **one-to-one** exactly as shown in these HTML files.

## Critical Requirements

- **Source of Truth**: The HTML files in the `screens/` folder are the definitive reference designs
- **Exact Replication**: Every visual element, spacing, color, typography, and layout must match the HTML prototypes precisely
- **No Improvisation**: Do not change or "improve" the design - replicate it pixel-perfect as shown
- **All Screens**: If there are many screens, create an appropriate implementation plan, but remember each screen must be an exact visual replica
- **All-in-One File**: The `*_all_in_one.html` file in the root is for preview only - use the individual screen HTML files in `screens/` as your reference

---

# Project Documentation: Course Platform LMS (Untitled Chat)

This document provides a comprehensive technical guide for developers to implement the **Course Platform LMS** mobile application. The primary goal is to replicate the provided high-fidelity prototypes with **pixel-perfect precision**.

---

## 1. Project Overview

**Course Platform LMS** is a modern, precision-minimal learning management system designed for mobile devices. The app focuses on a "calm and frictionless" experience, prioritizing content hierarchy and effortless progress tracking.

### Target Audience
- Professional learners seeking career advancement.
- Students switching career paths.
- Lifelong learners interested in personal growth (Design, Coding, Marketing, etc.).

### Key Features
- **Personalized Onboarding**: Goal and interest-based tailoring.
- **Progress Gamification**: Daily streaks and visual progress tracking.
- **Premium Content Delivery**: High-definition video player with resource downloads.
- **Discovery**: Robust search and category filtering for 2,000+ courses.
- **Monetization**: Tiered subscription model (Annual vs. Monthly) with seasonal offers.

---

## 2. Visual Flow Diagram

```text
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  welcome_onboarding    │  ──▶ │   goal_selection_quiz  │  ──▶ │ interest_selection_quiz│
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
                                            ▲                               │
                                            │                               ▼
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│    premium_paywall     │  ◀── │social_proof_testimonials│ ◀── │  educational_insight   │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
            │
            ▼
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│   learning_dashboard   │ ◀──▶ │   course_search_feed   │ ──▶  │     course_details     │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
            │                                                           │
            │           ┌────────────────────────┐                      │
            └─────────▶ │     lesson_player      │ ◀────────────────────┘
                        └────────────────────────┘
```

---

## 3. User Journeys

### Journey 1: Tailored Onboarding & Conversion
- **Purpose**: To collect user preferences and convert them into premium subscribers through authority-building and social proof.
- **Steps**: `welcome_onboarding.html` → `goal_selection_quiz.html` → `interest_selection_quiz.html` → `educational_insight.html` → `social_proof_testimonials.html` → `premium_paywall.html`.

### Journey 2: Daily Learning & Habit Building
- **Purpose**: To keep the user engaged with their current curriculum and maintain their daily streak.
- **Steps**: `learning_dashboard.html` → `lesson_player.html`.

### Journey 3: Discovery & Enrollment
- **Purpose**: To find new content and understand the value proposition of specific courses.
- **Steps**: `course_search_feed.html` (or Dashboard recommendations) → `course_details.html` → `lesson_player.html`.

---

## 4. Screen Inventory

### 4.1 Onboarding Group
| Screen Name | File | Purpose |
|:---|:---|:---|
| **Welcome** | `welcome_onboarding.html` | First impression. Showcases social proof (500k+ learners) and high-level value prop. |
| **Goal Quiz** | `goal_selection_quiz.html` | Step 1/6: Identifies primary motivation (Career, Personal, etc.). |
| **Interest Quiz** | `interest_selection_quiz.html` | Step 2/6: Multi-select tags (UI/UX, Dev, Marketing) for personalization. |
| **Educational Insight** | `educational_insight.html` | Step 3/6: Authority building. Uses data to prove the effectiveness of structured learning. |
| **Testimonials** | `social_proof_testimonials.html`| Step 4/6: Building trust via real-world success stories and star ratings. |
| **Paywall** | `premium_paywall.html` | Conversion. Highlights features (offline mode, certificates) and pricing tiers. |

### 4.2 Core App Group
| Screen Name | File | Purpose |
|:---|:---|:---|
| **Learning Dashboard** | `learning_dashboard.html` | Central hub. Shows current progress, daily streaks, and statistics. |
| **Course Search** | `course_search_feed.html` | Content discovery. Features a search bar, category chips, and search result list. |
| **Course Details** | `course_details.html` | Deep dive. Includes tutor bio, detailed curriculum, and enrollment CTA. |
| **Lesson Player** | `lesson_player.html` | The "Work" space. Fixed video player with lesson descriptions and resource downloads. |

---

## 5. Data Models

### User Profile
```typescript
interface User {
  id: string;
  name: string;
  avatarUrl: string;
  goal: 'career_advancement' | 'switch_career' | 'personal_growth' | 'certification';
  interests: string[]; // e.g., ['UI/UX', 'Business']
  isPremium: boolean;
  streakDays: number;
  stats: {
    certificatesEarned: number;
    lessonsCompleted: number;
  };
}
```

### Course
```typescript
interface Course {
  id: string;
  title: string;
  tutor: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  rating: number; // e.g., 4.9
  reviewCount: number;
  totalDuration: string; // e.g., "18h 30m"
  lessonCount: number;
  price: number;
  originalPrice: number;
  chapters: Chapter[];
}
```

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  isLocked: boolean;
  chapterId: string;
  description: string;
  resources: {
    fileName: string;
    fileSize: string;
    downloadUrl: string;
  }[];
}
```

---

## 6. Implementation Requirements

### Design Replication (Mandatory)
- **Source of Truth**: All screen HTML files in the `screens/` directory.
- **Fidelity**: Replicate every pixel. Pay specific attention to:
    - **Radius**: Cards and buttons use `16px` to `20px` corner radii.
    - **Borders**: Hairline `1px` borders using `#E5E7EB`.
    - **Shadows**: Soft ambient shadows `0 8 24 rgba(15,23,42,0.08)`.
    - **Colors**: 
        - Primary Cobalt: `#2563EB`
        - Text Main: `#0F172A`
        - Text Muted: `#64748B`
        - Background: `#F8FAFC` / `#FFFFFF`

### Technical Stack Recommendations
- **Mobile Framework**: React Native or Flutter.
- **Icons**: Iconify (Lucide set).
- **Styling**: Tailwind CSS (via NativeWind for React Native).
- **Video**: `expo-av` or `react-native-video`.

### Phased Implementation Plan
1.  **Phase 1: Navigation & Design System**: Set up the Tailwind configuration, shared color constants, and the `iphone-frame` layout wrapper.
2.  **Phase 2: Onboarding Flow**: Build screens 1 through 6, ensuring the progress bar at the top of the quiz screens functions correctly.
3.  **Phase 3: Dashboard & Discovery**: Implement the `learning_dashboard.html` (with horizontal carousels) and the `course_search_feed.html`.
4.  **Phase 4: Course Experience**: Finalize the `course_details.html` and the `lesson_player.html`. Ensure the sticky footers on these screens remain fixed relative to the video/CTA.

### Data Handling
- **Quiz States**: Store the user's selected goal and interests in global state (Redux/Zustand) to personalize the "Recommended" section on the Dashboard.
- **Lesson Tracking**: Persist completion status locally and sync with the backend to update the 65% progress bar on the Dashboard card.