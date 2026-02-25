# Babylon Login App

A Next.js application with Firebase Authentication (Email/Password), featuring user registration, login, and a protected home page.

## Tech Stack

- **Next.js 14** (App Router)
- **Firebase Authentication** (Email/Password)
- **TypeScript**
- **Tailwind CSS**

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A [Firebase](https://console.firebase.google.com/) account

---

## 1. Clone the Repository

```bash
git clone https://github.com/Amitphadol/Babylon-login-app.git
cd babylon-login-app
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Firebase Setup

### a. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** and follow the setup wizard
3. Once created, open your project dashboard

### b. Enable Email/Password Authentication

1. In the left sidebar, go to **Build → Authentication**
2. Click the **Sign-in method** tab
3. Click **Email/Password** and toggle it **on**
4. Click **Save**

### c. Register a Web App & Get Your Config

1. In the left sidebar, click the **gear icon → Project Settings**
2. Scroll down to **Your apps** and click the **`</>`** (Web) icon
3. Enter an app nickname and click **Register app**
4. Copy the `firebaseConfig` object — you'll need these values in the next step

---

## 4. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase config values:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
babylon-login-app/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── page.tsx          # Login / Register page
│   └── home/
│       └── page.tsx      # Protected home page
├── lib/
│   └── firebase.ts       # Firebase initialization
├── .env.example          # Environment variable template
├── .env.local            # Your local secrets (not committed)
├── tailwind.config.ts
└── tsconfig.json
```

---

## Features

- **User Registration** — create an account with full name, email, and password
- **Login** — authenticate with email and password
- **Protected Route** — `/home` redirects unauthenticated users to login
- **Display Name** — full name stored via Firebase `displayName` and shown after login
- **Logout** — signs out and redirects to the login page
- **Error Handling** — clear messages for invalid email, wrong password, weak password, and more

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Approach

Authentication is handled entirely through Firebase's client SDK. On registration, `createUserWithEmailAndPassword` creates the account and `updateProfile` stores the user's full name as `displayName`. On login, `signInWithEmailAndPassword` retrieves the existing user. The home page uses `onAuthStateChanged` to listen for auth state — unauthenticated users are redirected to the login page automatically.

---

## Challenges

- **`displayName` timing** — Firebase's `onAuthStateChanged` can fire before `updateProfile` completes on first registration, so the update is awaited before redirecting.
- **Error code mapping** — Firebase returns internal error codes (e.g. `auth/wrong-password`) that need to be translated into user-friendly messages.

---
