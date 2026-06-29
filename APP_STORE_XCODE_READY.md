# Dose & Mood iOS App Store Handoff

This version is configured as the clean logger app, not the 30-day demo. A fresh install opens basic onboarding and stores entries locally on the device.

## Current Native Settings

- App display name: `Dose & Mood`
- iOS bundle identifier: `com.doseandmood.logger`
- Build number: `1`
- App icon: `assets/app-icon.png`
- Splash image: `assets/splash.png`
- Storage model: local-first MVP with user-triggered export
- Medical posture: personal tracking tool, not medical advice; no diagnosis, no cause claim, no dose recommendation

Before submission, confirm the bundle identifier matches the Apple Developer account naming you want. If you need a different identifier, change `ios.bundleIdentifier` in `app.json` before creating the Xcode archive.

## Xcode Path On A Mac

Run from the cloned repo root:

```bash
npm install
npm run typecheck
npx expo prebuild --platform ios --clean
cd ios
pod install
open *.xcworkspace
```

In Xcode:

1. Select the app target.
2. Set the Apple Team under Signing & Capabilities.
3. Confirm bundle identifier and display name.
4. Select a generic iOS device or Any iOS Device.
5. Product > Archive.
6. Distribute App > App Store Connect.

## EAS Alternative

If you prefer a cloud iOS build:

```bash
npm install
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --profile production
```

This still requires Apple Developer credentials.

## App Store Notes To Prepare

- Privacy policy should say entries are local-first, not sold, and exported only by user action.
- App Review notes should mention the app is a logging tool, not medical advice, and it does not recommend medication changes.
- Health/medical disclaimer should match the in-app copy.
- Crisis support copy should mention U.S. 988 call/text/chat and that emergency services should be used for immediate danger.
- If you add cloud sync, analytics, accounts, push notifications, Face ID, or AI later, update App Privacy answers and native permissions before submission.

## App Privacy Starting Point

For the current MVP code:

- Data collection: no account, no backend, no ads, no analytics in this build.
- Storage: local device storage through AsyncStorage.
- Sharing: user-triggered native share sheet for summaries.
- Tracking: no tracking.
- Sensitive data: health and wellness entries are created by the user and remain local unless exported.

Do not submit these answers blindly if the build changes. Re-check dependencies and any added services before App Store submission.
