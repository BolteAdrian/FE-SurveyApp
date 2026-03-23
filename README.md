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

## 📖 User Guide & Product Walkthrough

The **SurveyApp** provides a comprehensive end-to-end ecosystem, allowing administrators to manage contact databases, distribute professional email invitations, and perform deep-dive data analysis.

---

### 👑 1. Administrator Experience (Management & Distribution)

#### 🔐 A. Authentication
Administrators must authenticate to access the secure dashboard. The system supports dedicated routes for both login and new account registration.

| Task | Screenshot | Admin Route |
| :--- | :--- | :--- |
| **Login** | <img width="1000" height="600" alt="Screenshot 2026-03-23 at 23 53 57" src="https://github.com/user-attachments/assets/0e559f9b-f30b-404f-b845-022b4de1246d" /> | `/login-admin` |
| **Registration** | <img width="1000" height="600" alt="Screenshot 2026-03-24 at 00 02 33" src="https://github.com/user-attachments/assets/1629169b-d8f5-4121-85b1-b5b698039f1e" />| `/register-admin` |

*The authentication portal features full i18n support (RO/EN) and secure credential handling.*

#### 👥 B. Contact Management & CSV Import
Organize your respondents into specific lists for targeted outreach.

* **Create Lists**: Generate separate lists for different departments, campaigns, or demographics.
<img width="1000" height="500" alt="Screenshot 2026-03-24 at 00 23 20" src="https://github.com/user-attachments/assets/dab70473-3fad-4ed0-8a12-ad80fa483d8d" />

* **Smart CSV Import**: Bulk upload thousands of contacts using CSV files containing `email` and `name` (optional) columns.
<img width="984" height="714" alt="Screenshot 2026-03-24 at 00 23 32" src="https://github.com/user-attachments/assets/5aad6791-58b0-4741-8234-13e0dddb0b5f" />

* **Manual Entry**: Easily add individual contacts to any list via an intuitive in-app form.
<img width="1000" height="500" alt="Screenshot 2026-03-24 at 00 23 51" src="https://github.com/user-attachments/assets/e2b88657-2d29-4a6a-addf-1c6661afd222" />

* **Validation**: The system automatically ignores duplicate emails and flags invalid addresses before import.

#### 🏗️ C. Survey Creation & Building
The dynamic builder allows for highly customizable survey structures.

<img width="1000" height="500" alt="Screenshot 2026-03-24 at 00 04 18" src="https://github.com/user-attachments/assets/89fe517c-93ac-4eeb-9a84-0471e42cffb8" />

* **Dynamic Editor**: Add or edit questions using specialized modals for `Multi-choice` or `Free Text`.
<img width="1000" height="700" alt="Screenshot 2026-03-24 at 00 05 22" src="https://github.com/user-attachments/assets/72b68266-f123-47b4-9bfd-10e8a0fddcb0" />
<img width="1000" height="700" alt="Screenshot 2026-03-24 at 00 05 45" src="https://github.com/user-attachments/assets/a94adddc-9c4a-4ecc-87e4-54f8a455d9e4" />
  
* **Live Slug Generation**: The survey's URL slug is automatically generated from the title but remains fully editable for SEO purposes.
* **Drag & Drop**: Reorder questions instantly using a smooth drag-and-drop interface.

#### 📧 D. Email Invitation Workflow
Once a survey is **Published**, administrators can manage targeted email distributions.
<img width="1000" height="800" alt="Screenshot 2026-03-24 at 00 24 18" src="https://github.com/user-attachments/assets/ca3556ef-a56b-4b0f-ae2b-f3894881eb43" />

* **List Selection**: Choose a specific contact list to receive the survey.
* **Smart Skip**: The system automatically previews and skips contacts who have already received an invitation to prevent spam.
* **Real-time Tracking**: Monitor invitation statuses such as "Email Opened," "Survey Opened," and "Completed".

---

### 👤 2. Respondent Experience (Unauthenticated User)

The workflow for survey takers is optimized for high completion rates and requires no account.

1.  **Email Invitation**: The respondent receives a professional HTML email invitation with a direct link to the survey.
   <img width="1000" height="500" alt="Screenshot 2026-03-24 at 00 38 09" src="https://github.com/user-attachments/assets/cbe8d8f2-c898-4475-8cfe-a80617a07855" />

3.  **Survey Completion**: Upon clicking the link, the user is directed to a clean, focused survey form to provide their feedback.
<img width="531" height="826" alt="Screenshot 2026-03-24 at 00 44 49" src="https://github.com/user-attachments/assets/87e9eb22-41d7-4d6f-88bf-f1d577d48f2c" />

---

### 📊 3. Advanced Analytics & Reporting

After data is collected, administrators can access a high-level statistical overview of the survey performance.

<img width="1000" height="700" alt="Screenshot 2026-03-24 at 00 24 37" src="https://github.com/user-attachments/assets/36706b41-2101-41d6-a579-7b0c06f6aa16" />
<img width="1000" height="700" alt="Screenshot 2026-03-24 at 00 24 58" src="https://github.com/user-attachments/assets/2986190d-6714-4042-9648-de55cd8873c9" />

* **Conversion Funnel**: A visual breakdown of the respondent journey: *Invited → Sent → Email Opened → Survey Opened → Submissions*.
* **Performance Metrics**: Real-time calculation of **Bounce Rate** and **Completion Rate**.
* **Visual Data**: Multi-choice results are displayed with percentage bars featuring a custom "emerald glow" effect.
* **Qualitative Analysis**: A dedicated **Comments** tab allows for keyword searching and filtering of text-based feedback.
* **Optimized Performance**: Large qualitative datasets are handled smoothly via client-side pagination.

---

### 📱 4. Fully Responsive Design
The entire application is built with a **Mobile-First** approach, ensuring full functionality across all screen sizes.

<img width="376" height="830" alt="Screenshot 2026-03-24 at 00 25 31" src="https://github.com/user-attachments/assets/b7efdf73-693b-41e1-848f-3da809c2a255" />

* **Desktop**: Detailed, wide-screen dashboards for complex management.
* **Tablet & Mobile**: Adaptive navigation with retractable sidebars and touch-optimized survey forms.

---
*Happy Surveying! 🚀*
