# Campus Connect

Campus Connect is a cross-platform mobile application developed for Manipal University Jaipur (MUJ) students — particularly new, international, and outstation students — to make campus life more accessible, engaging, and socially connected.

Built using React Native, TypeScript, and Expo, it integrates essential student utilities such as campus navigation, event tracking, cultural tips, and peer connections into a single, seamless platform.

---

## Overview

Many MUJ students face challenges navigating the large campus, adapting to cultural norms, or finding accurate information during their first weeks. Campus Connect addresses these problems through an interactive, student-centered app that serves as an all-in-one guide to campus life.

**Key goals:**
- Help students navigate the campus efficiently.
- Promote social integration and cross-cultural exchange.
- Provide centralized access to events and campus information.
- Enhance student engagement through technology.

---

## Features

### 1. Interactive Campus Map
- Real-time navigation powered by React Native Maps and Google Maps integration.
- Filter by categories such as hostels, cafeterias, academic blocks, libraries, etc.
- Tap markers for detailed info and directions.

### 2. Onboarding & Authentication
- Interactive onboarding screens introduce new users to the app.
- Secure login/signup via mock authentication using AsyncStorage for session persistence.

### 3. Cultural Integration
- Categorized cultural and academic tips on topics like social etiquette, campus culture, and study habits.
- Search, bookmark, and share tips via an intuitive accordion UI.

### 4. Events & Activities
- Centralized event calendar with daily and monthly views.
- “I’m Interested” and “Add to Calendar” features for easy participation.
- Keeps students updated on cultural, academic, and sports events.

### 5. Social Networking
- Language Buddy System connects students with peers sharing similar languages or interests.
- Planned expansion for in-app chat and real-time communication.

### 6. User Profile & Customization
- Create personalized profiles including languages, interests, and country info.
- Edit and manage details easily from the Profile tab.

---

## Technology Stack

| Category              | Technology                        | Description                                 |
|-----------------------|-----------------------------------|---------------------------------------------|
| Framework             | React Native (v0.79.5)            | Cross-platform native development           |
| Toolchain             | Expo (v53.0.22)                   | Simplifies builds, deployment & OTA updates |
| Language              | TypeScript (v5.8.3)               | Ensures type safety & scalability           |
| Routing               | Expo Router, React Navigation     | File-based, type-safe navigation            |
| State Management      | React Context API, AsyncStorage   | Persistent, global state management         |
| Specialized Libraries | Native Maps, Native Calendars     | Mapping and event calendar integration      |

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation Steps

```sh
git clone https://github.com/your-username/campus-connect.git
cd campus-connect
npm install
npx expo start
```

Run the app using:

- **Android:** `npx expo start --android`
- **iOS:** `npx expo start --ios`

---

## Download & Install

**Scan the QR code below to download the app:**

<!-- Replace the image link below with your actual QR code image -->
<p align="center">
  <img src="https://drive.google.com/file/d/1Q1TI4XFsi2rwej1jvVzazwqhccIUejV2/view?usp=sharing" alt="Download Campus Connect QR" width="200"/>
</p>

**Instructions:**
1. **Scan the QR code** using your phone’s camera or a QR scanner app.
2. **Install the APK** or open the link in [Expo Go](https://expo.dev/go) if prompted.
3. **Sign up** with your email and set up your profile.
4. **Start exploring** the campus and features!

---

## Project Structure

```
.
├── app/                # Screens and routes
├── assets/             # Images, icons, fonts
├── components/         # Reusable UI elements
├── config/             # Firebase, constants
├── context/            # Auth & Theme context
├── hooks/              # Custom React hooks
├── services/           # API & backend services
├── utils/              # Helper functions
└── README.md
```

---

## Credits

Developed by:
- Lalit M Rao – Team Leader & Full-Stack Developer ([GitHub ID](https://github.com/lalit-rao))
- Tushar – Backend Developer ([GitHub ID](https://github.com/TusharSinghal2004))
- Veer Jain – Backend Developer & Survey Analyst ([GitHub ID](https://github.com/vjn6805))

---
