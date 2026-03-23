# SurveyApp - Frontend

The client-side application for **SurveyApp**, built with **React 19**, **Vite**, and **Tailwind CSS**.  
This dashboard allows users to create, manage, and analyze surveys with a focus on speed and smooth UX.


## Backend link :
https://github.com/BolteAdrian/BE-SurveyApp

---

## 🚀 Key Features

- **React 19 & Vite**: Ultra-fast development and optimized production builds.
- **Zustand State Management**: Lightweight and predictable state handling without the boilerplate of Redux.
- **Dynamic Survey Builder**: Drag-and-drop question reordering using `@hello-pangea/dnd`.
- **i18n Support**: Full localization support using `react-i18next`.
- **Responsive UI**: Fully styled with **Tailwind CSS** and **Lucide React** icons.
- **CSV Export**: Data analysis made easy via `papaparse`.

---

## 🏗️ Technologies

- **Node.js**: 25.8.1
- **npm**: 11.11
- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS, Autoprefixer, PostCSS
- **State**: Zustand
- **Routing**: React Router 7
- **Networking**: Axios
- **Notifications**: React Toastify
- **Icons**: Lucide React

---

## 📁 Project Structure

survey-frontend/
├─ src/
│  ├─ api/          # Axios instance & API calls
│  ├─ components/   # Shared UI components (Buttons, Inputs, Modals)
│  ├─ hooks/        # Custom React hooks
│  ├─ i18n/         # Localization configuration
│  ├─ pages/        # View components (Dashboard, Survey Editor, Analytics)
│  ├─ store/        # Zustand stores
│  └─ utils/        # Helper functions & formatting
├─ public/          # Static assets
└─ index.html

1. Install Dependencies:

npm install

2. Configure Environment:
Create a .env file in the root directory:
VITE_API_URL=http://localhost:3000/api

3. Start Development Server:
npm run dev

## 🏃‍♂️ Available Scripts

Script	Description
npm run dev	Start development server with Vite
npm run build	Build for production (Typecheck + Vite build)
npm run lint	Run ESLint to check code quality
npm run preview	Preview the production build locally