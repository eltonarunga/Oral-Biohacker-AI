# Oral Biohacker AI 🦷✨

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

An AI-powered health dashboard providing personalized oral biohacking plans, habit coaching, and a symptom checker tailored to your unique biometrics. Take control of your oral health with data-driven insights and cutting-edge AI.

## 🌟 Key Features

- **🤖 AI-Generated Biohacking Plan:** Receive a personalized plan based on your biometrics, including supplement, routine, and nutritional guidance.
- **🩺 Intelligent Symptom Checker:** Chat with an AI assistant to understand your oral health symptoms and get safe, reliable information.
- **✅ Daily Habit Tracking:** Build and maintain crucial oral health habits with a satisfying progress tracker and streak monitoring.
- **🎨 Smile Design Studio:** Visualize your perfect smile. Upload a photo and let AI generate an enhanced version.
- **🧑‍⚕️ Find a Dentist:** Instantly locate nearby dental professionals using your location.
- **📚 Educational Content:** Access a curated knowledge base of articles on oral health topics.
- **👤 Secure User Profiles:** Manage your health data, biometrics, and personal goals in one place, with data persisted on a secure backend.
- **🌓 Light & Dark Mode:** A beautiful, responsive interface that's easy on the eyes, day or night.

## 📸 Screenshots

*(Add screenshots of the application here to showcase its features and user interface.)*

| Dashboard | Personalized Plan | Symptom Checker |
| :---: | :---: | :---: |
| *Dashboard Screenshot* | *Personalized Plan Screenshot* | *Symptom Checker Screenshot* |

## 🛠️ Architecture: Client-Server Model

This project is a modern, single-page application (SPA) frontend designed to communicate with a secure backend API.

- **Frontend:** A pure [React](https://reactjs.org/) (v19) and [TypeScript](https://www.typescriptlang.org/) application responsible for all user interface rendering and interactions.
- **Backend (Required):** The frontend is built to make API calls to a backend service (e.g., a Node.js/Python/Go server deployed on **Google Cloud Run**). The backend is responsible for:
  - Securely calling the **Google Gemini API**. The API key is stored on the server, not in the frontend.
  - Handling user authentication (sign-up, sign-in, session management).
  - Persisting all user data (profiles, plans, habits) in a database (like Firestore or PostgreSQL).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN).
- **Module Loading:** ES Modules with [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) for a build-free development experience.

## 📂 Project Structure

```
.
├── components/         # Reusable React components
│   ├── common/         # Basic, general-purpose components (Card, Spinner)
│   └── ...             # Feature-specific components
├── data/               # Static assets (predefined avatars)
├── services/           # Modules for external API calls (apiService.ts)
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component and state management
├── index.html          # The single HTML page entry point
├── index.tsx           # React application root
└── README.md           # This file
```

## 🚀 Getting Started

This project contains only the frontend code. To run it, you need a running backend that implements the API endpoints the frontend expects to call.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A running backend service that handles `/api/...` routes for auth, data, and AI features.
- A local web server for the frontend. Node.js users can use `serve`.

### Running the Frontend

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure API Proxy:**
    If you are deploying the frontend to a static host like Vercel or Netlify, you must configure a proxy rewrite rule to direct API calls to your backend. The included `vercel.json` provides an example. Update the `destination` URL to point to your deployed backend service (e.g., your Google Cloud Run URL).
    ```json
    // vercel.json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "https://your-backend-service-url.a.run.app/api/$1" },
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```

3.  **Serve the application:**
    
    **Using `serve` (recommended):**
    ```sh
    # Install serve if you don't have it
    npm install -g serve
    
    # Run the server from the project root
    serve .
    ```

4.  **Open the application** in your browser. If you used `serve`, it's likely at `http://localhost:3000`.

## 🗺️ Backend API Requirements

The frontend expects the backend to expose the following (or similar) endpoints:

- **Auth:**
  - `POST /api/auth/google`: Handle Google Sign-In.
  - `POST /api/auth/signup`: Handle email/password registration.
  - `POST /api/auth/signin`: Handle email/password login.
  - `GET /api/me`: Get the current authenticated user's profile from a session token.

- **Data:**
  - `GET /api/data`: Fetch the user's extended data (plan, habits, etc.).
  - `PUT /api/profile`: Update the user's core profile.
  - `PUT /api/data`: Update the user's extended data (e.g., toggling a habit).
  - `POST /api/export`: Export user data.
  - `DELETE /api/account`: Delete the user's account and all data.

- **AI Features:**
  - `POST /api/generate-plan`: Generate a personalized plan.
  - `POST /api/symptom-checker`: Send a message history to the symptom checker AI.
  - `POST /api/find-dentists`: Find dentists near a given location.
  - `POST /api/smile-design`: Generate an enhanced smile image.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This is a technology demonstration and is **not a substitute for professional medical advice, diagnosis, or treatment**. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
