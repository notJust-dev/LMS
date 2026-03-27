# 🎨 DESIGN REPLICATION INSTRUCTIONS

> **IMPORTANT**: The screen HTML files are located in the `screens/` folder within this exported ZIP file. You MUST replicate the designs **one-to-one** exactly as shown in these HTML files.

## Critical Requirements

- **Source of Truth**: The HTML files in the `screens/` folder are the definitive reference designs
- **Exact Replication**: Every visual element, spacing, color, typography, and layout must match the HTML prototypes precisely
- **No Improvisation**: Do not change or "improve" the design - replicate it pixel-perfect as shown
- **All Screens**: If there are many screens, create an appropriate implementation plan, but remember each screen must be an exact visual replica
- **All-in-One File**: The `*_all_in_one.html` file in the root is for preview only - use the individual screen HTML files in `screens/` as your reference

---

# Project Documentation: Course Platform LMS

## 1. Project Overview

**Project Title**: Untitled Chat (Course Platform LMS)  
**App Name**: Course Platform LMS  
**Target Platform**: Mobile (iOS/Android)  
**Design Style**: Precision Minimal (Shippable Premium)

### Summary
Course Platform LMS is a high-end, frictionless learning management system designed for modern professionals and students. The app focuses on structured learning through expert-led video content, interactive quizzes, and industry-recognized certification. The aesthetic is "Precision Minimal," characterized by a calm, airy atmosphere, cobalt accents, and a clear content hierarchy that minimizes cognitive load during the learning process.

### Target Audience
- Career switchers seeking new industry skills.
- Professionals looking for career advancement or certifications.
- Lifelong learners exploring creative hobbies and personal growth.

### Key Features
- **Personalized Onboarding**: A data-driven quiz flow to tailor course recommendations.
- **Educational Insights**: Value-add statistics to increase user motivation and retention.
- **Social Proof**: Integration of community size and high-quality student testimonials.
- **Premium Subscription**: Tiered access to 2,000+ courses, offline mode, and certifications.

---

## 2. Visual Flow Diagram

```text
┌────────────────────────┐
│ welcome_onboarding.html│
└───────────┬────────────┘
            │
            ▼ (Get Started)
┌───────────────────────────┐
│ goal_selection_quiz.html  │◀──────┐
└───────────┬───────────────┘       │
            │                       │ (Back)
            ▼ (Continue)            │
┌───────────────────────────┐       │
│ interest_selection_quiz.html ─────┘
└───────────┬───────────────┘
            │
            ▼ (Continue)
┌───────────────────────────┐
│   educational_insight.html│
└───────────┬───────────────┘
            │
            ▼ (Continue journey)
┌─────────────────────────────┐
│ social_proof_testimonials.html 
└───────────┬─────────────────┘
            │
            ▼ (Next)
┌───────────────────────────┐
│    premium_paywall.html   │
└───────────────────────────┘
```

---

## 3. User Journeys

### Journey 1: Personalized Onboarding & Value Building
**Goal**: Guide the user from initial discovery to a personalized learning profile while establishing trust.
1. **Introduction**: User lands on `welcome_onboarding.html`, seeing the scale of the community (500k+ learners).
2. **Personalization**: User identifies their "Why" in `goal_selection_quiz.html` and their "What" in `interest_selection_quiz.html`.
3. **Authority Building**: The app provides a scientific "Did you know?" fact in `educational_insight.html` to justify the app's structured curriculum.
4. **Validation**: User reads specific success stories in `social_proof_testimonials.html`.

### Journey 2: Conversion (Premium Entry)
**Goal**: Convert a free user to a paid subscriber through limited-time urgency.
1. **Closing the Loop**: After seeing testimonials, the user is presented with the `premium_paywall.html`.
2. **Urgency**: A FOMO-driven "Spring Sale" countdown encourages immediate subscription.
3. **Selection**: User chooses between Annual (Value) or Monthly plans.

---

## 4. Screen Inventory

### 4.1 welcome_onboarding.html
- **Purpose**: Initial brand impression and primary entry point.
- **Key UI Elements**: Full-bleed hero image, floating social proof pill (avatars + rating), cobalt primary CTA.
- **User Actions**: Tap "Get Started" to begin onboarding; Tap "Log In" for existing users.
- **Exit Points**: `goal_selection_quiz.html`.

### 4.2 goal_selection_quiz.html
- **Purpose**: Segment users by their primary motivation.
- **Key UI Elements**: Progress bar (1/6), vertical option cards with icons and descriptions.
- **User Actions**: Select a goal (Career, Switch, Personal, Certs); Tap "Continue".
- **Notes**: Active selection must toggle the `.active` class (cobalt border and light blue background).

### 4.3 interest_selection_quiz.html
- **Purpose**: Gather topical preferences for the recommendation engine.
- **Key UI Elements**: Progress bar (2/6), 2-column icon grid.
- **User Actions**: Toggle multiple interests (UI/UX, Dev, Marketing, etc.); Tap "Continue".
- **Notes**: High-visual-density grid with 14-18px corner radius.

### 4.4 educational_insight.html
- **Purpose**: Reinforce the value of the platform's methodology (Educational Strategy).
- **Key UI Elements**: Progress bar (3/6), 3D abstract data visualization, "Did you know?" badge.
- **User Actions**: Tap "Continue journey".

### 4.5 social_proof_testimonials.html
- **Purpose**: Overcome user skepticism using peer validation.
- **Key UI Elements**: Progress bar (4/6), stacked testimonial cards with star ratings and professional bios.
- **User Actions**: Tap "Next".

### 4.6 premium_paywall.html
- **Purpose**: Monetization and feature showcase.
- **Key UI Elements**: Red FOMO countdown badge, feature checklist, tiered pricing cards, "Best Value" indicator.
- **User Actions**: Tap "Subscribe Now"; Tap "X" to close; Toggle between Annual/Monthly.

---

## 5. Data Models

### 5.1 User Profile (Onboarding State)
```json
{
  "onboarding_goal": "String (e.g., 'career_switch')",
  "interests": ["Array of Strings (e.g., ['design', 'business'])"],
  "onboarding_progress": "Integer (1-6)",
  "is_premium_eligible": "Boolean"
}
```

### 5.2 Subscription Plans
| Field | Type | Description |
| :--- | :--- | :--- |
| plan_id | String | Unique identifier (annual_01, monthly_01) |
| name | String | Display name |
| price_usd | Float | Current price |
| discount_pct | Integer | Current discount (e.g., 40) |
| features | Array | List of included benefits |

---

## 6. Implementation Requirements

### Design Replication (Critical)
The developer **MUST** replicate the HTML prototypes exactly. The CSS variables defined in the root of the HTML files are the source of truth for the theme:

- **Primary Color**: `#2563EB` (Cobalt)
- **Main Text**: `#0F172A` (Slate)
- **Muted Text**: `#64748B`
- **Border**: `#E5E7EB` (Hairline)
- **Background**: `#F8FAFC` or `#FFFFFF`
- **Shadows**: `0 8px 24px rgba(15, 23, 42, 0.08)`
- **Radius**: `1rem` (16px) for cards, `1.5rem` (24px) for buttons.

### Technical Stack Recommendations
- **Styling**: Tailwind CSS (Utility-first approach as per prototypes).
- **Icons**: Iconify (Lucide set).
- **Images**: High-end minimalist photography (maintain the high aspect ratios defined in `Generation-Info`).

### Phased Implementation Plan
1. **Phase 1: Foundation & Navigation**: Set up the Global Theme (colors, spacing) and the frame/navigation logic for the linear onboarding flow.
2. **Phase 2: Quiz & Interactive Screens**: Implement `goal_selection_quiz.html` and `interest_selection_quiz.html` with state management for selections.
3. **Phase 3: Value & Content**: Implement `welcome_onboarding.html`, `educational_insight.html`, and `social_proof_testimonials.html`.
4. **Phase 4: Conversion**: Finalize `premium_paywall.html` including the countdown timer logic and pricing toggle.

### Design Precision Check
- Ensure the "Social Proof Pill" in Screen 1 maintains the `-space-x-2` avatar stacking.
- Ensure the "Sale Countdown" in Screen 6 uses the specific red semantic colors (#FEF2F2 bg, #EF4444 icon, #DC2626 text).
- Ensure all buttons have the `active:scale-[0.98]` transition for tactile feedback.