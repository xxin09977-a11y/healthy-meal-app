# Healthy Meal App

A Progressive Web App (PWA) for discovering healthy meal recipes and nutritional information.

## Features

- 🥗 Browse healthy meal suggestions
- 🔍 Search meals by name or description
- 🏷️ Filter by meal category
- 📱 Fully responsive design
- 📲 Works offline (PWA)
- 🚀 Fast and lightweight

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Building APK

### Using GitHub Actions (Recommended)

1. Push code to GitHub
2. GitHub Actions automatically builds APK
3. Download from Actions > Artifacts

### Local Build

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Add Android platform
npx cap add android

# Sync and build
npx cap sync
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Installation on Android

1. Transfer APK to your Android phone
2. Enable "Unknown sources" in Settings
3. Open APK and install
4. Grant permissions when prompted

## Technologies

- React 19
- Vite
- Capacitor
- PWA (Service Worker)

## License

MIT
