# Dose & Mood

Dose & Mood is an iPhone-first Expo MVP for private GLP-1 mental wellness tracking.

The app is intentionally local-first and safety-aware. It helps users log mood, anxiety, sleep, food, appetite, GLP-1 dose timing, side effects, substances, and notes so they can share patterns with a clinician. It does not diagnose, tell users to change medication, or claim GLP-1 medications cause mental health changes.

## Current Build

This repo is the clean logger version intended for native iOS packaging. A fresh install opens basic onboarding and does not prefill a Maya/Summer demo profile. The 30-day demo remains a web-preview mode only.

## Run

Install dependencies, then run:

```bash
npm install
npm run web
```

For a phone preview with Expo Go:

```bash
npm run start
```

## Xcode / App Store Path

On a Mac with Xcode and CocoaPods:

```bash
npm install
npm run typecheck
npx expo prebuild --platform ios --clean
cd ios
pod install
open *.xcworkspace
```

Then set Apple signing in Xcode, archive, and upload to App Store Connect.

See `APP_STORE_XCODE_READY.md` for the full handoff checklist.

## Safety Copy

The interface includes:

- "This is a personal tracking tool, not medical advice."
- Prominent "Need help now?" access from every app screen.
- 988 call, text, and chat actions for U.S. crisis support.
- Careful "possible pattern" and "worth discussing" language.
- No dose-change recommendations.

## MVP Components

- `OnboardingFlow`
- `DailyCheckIn`
- `MoodBubbleSelector`
- `SubstanceTracker`
- `DoseTracker`
- `InsightCards`
- `CrisisSupportButton`
- `ReminderSettings`
- `ExportSummary`
- `MascotCompanion`
