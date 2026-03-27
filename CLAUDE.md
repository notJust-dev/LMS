# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LMS (Learning Management System) — a React Native / Expo mobile app using file-based routing (Expo Router). The project targets iOS, Android, and web.

## Commands

- **Start dev server:** `npx expo start`
- **iOS:** `npx expo start --ios`
- **Android:** `npx expo start --android`
- **Web:** `npx expo start --web`
- **Lint:** `npx expo lint`
- **Install deps:** `npm install`

## Architecture

- **Expo SDK 55** with React Native 0.83, React 19, TypeScript 5.9
- **File-based routing** via `expo-router` — routes live in `src/app/`
- **Path aliases:** `@/*` maps to `./src/*`, `@/assets/*` maps to `./assets/*`
- **React Compiler** is enabled (`experiments.reactCompiler: true` in app.json)
- **Typed routes** are enabled (`experiments.typedRoutes: true`)
- Entry point: `expo-router/entry` (configured in package.json `main`)
- The `example/` directory contains the original Expo template code for reference — it is not part of the running app

## Styling — Tailwind CSS v4 + NativeWind v5

- Uses `react-native-css` with `useCssElement` wrappers — **do not use raw RN components with `className`**
- Import styled components from `@/tw` (View, Text, ScrollView, Pressable, TextInput, Link, TouchableHighlight, AnimatedScrollView) and `@/tw/image` (Image)
- `@/tw/animated` exports `Animated.View` wrapped for CSS support
- Global CSS lives in `src/global.css` (imported in `_layout.tsx`); theme customization uses `@theme` blocks in CSS, not a JS config file
- Platform-specific styles use `@media ios` / `@media android` in CSS
- `useCSSVariable` hook from `@/tw` reads CSS variables in JS (returns `var(--name)` on web, resolved value on native)
- `tailwind-merge` and `clsx` are available for conditional/merged class names
- Metro config (`metro.config.js`) wraps with `withNativewind`; PostCSS config uses `@tailwindcss/postcss`

## Key Dependencies

- `react-native-reanimated` + `react-native-gesture-handler` for animations/gestures
- `react-native-screens` + `react-native-safe-area-context` for navigation
- `expo-image` for optimized image loading
- `expo-glass-effect` for blur/glass UI effects
