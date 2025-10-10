# Firebase Authentication Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `campus-connect`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location closest to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Enter app nickname: `campus-connect-app`
5. Click "Register app"
6. Copy the configuration object

## 5. Update Environment Variables

Replace the values in your `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

## 6. Install Dependencies

Run the installation script:
```bash
./install-firebase.bat
```

Or manually:
```bash
npm install firebase
```

## 7. Test Authentication

1. Start your app: `npx expo start`
2. Try creating a new account
3. Check Firebase Console > Authentication > Users to see registered users
4. Check Firestore > Data to see user documents

## Security Rules (Optional)

Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

✅ Email/Password Authentication
✅ User Registration with Firestore
✅ Password Reset
✅ Persistent Authentication State
✅ User Profile Management
✅ Secure Environment Variables