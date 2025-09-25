# Oral Biohacker AI 🦷✨

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

An AI-powered health dashboard providing personalized oral biohacking plans, habit coaching, and a symptom checker tailored to your unique biometrics. Take control of your oral health with data-driven insights and cutting-edge AI.

## 🌟 Key Features

- **🤖 AI-Generated Biohacking Plan:** Receive a personalized plan based on your biometrics, including supplement, routine, and nutritional guidance.
- **🩺 Intelligent Symptom Checker:** Chat with an AI assistant to understand your oral health symptoms and get safe, reliable information.
- **✅ Daily Habit Tracking:** Build and maintain crucial oral health habits with a satisfying progress tracker and streak monitoring.
- **🎨 Smile Design Studio:** Visualize your perfect smile. Upload a photo and let AI generate an enhanced version.
- **🧑‍⚕️ Find a Dentist:** Instantly locate nearby dental professionals using your location.
- **📚 Educational Content:** Access a curated knowledge base of articles on oral health topics.
- **👤 Comprehensive User Profile:** Manage your health data, biometrics, and personal goals in one secure place.
- **🌓 Light & Dark Mode:** A beautiful, responsive interface that's easy on the eyes, day or night.

## 📸 Screenshots

*(Add screenshots of the application here to showcase its features and user interface.)*

| Dashboard | Personalized Plan | Symptom Checker |
| :---: | :---: | :---: |
| *Dashboard Screenshot* | *Personalized Plan Screenshot* | *Symptom Checker Screenshot* |

## 🛠️ Technology Stack

- **Frontend:** [React](https://reactjs.org/) (v19), [TypeScript](https://www.typescriptlang.org/)
- **AI Model:** [Google Gemini API](https://deepmind.google/technologies/gemini/) (`gemini-2.5-flash`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Charting:** [Recharts](https://recharts.org/)
- **Module Loading:** ES Modules with [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) for a build-free development experience.
- **Data Persistence:** Client-side `localStorage` for offline functionality and session persistence.

## 📂 Project Structure

```
.
├── components/         # Reusable React components
│   ├── common/         # Basic, general-purpose components (Card, Spinner)
│   └── ...             # Feature-specific components
├── data/               # Mock data and static assets
├── services/           # Modules for external API calls (Gemini AI)
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component and routing logic
├── index.html          # The single HTML page entry point
├── index.tsx           # React application root
└── README.md           # This file
```

## 🚀 Getting Started

This project is a static web application that can be run by serving the files from any simple HTTP server.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local web server. Node.js users can use `serve`. Python users can use the built-in `http.server`.
- A valid **Google Gemini API Key**.

### Setup and Running the App

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up your API Key:**
    The application requires the Google Gemini API key to be available as an environment variable named `API_KEY`. The execution environment (like a serverless function, or a specialized dev server) must provide this variable.
    
    For local development, you may need to temporarily modify `services/geminiService.ts`:
    - **Original:** `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
    - **Temporary Change:** `const ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY_HERE' });`
    
    **⚠️ Important:** Do not commit your API key to version control.

3.  **Serve the application:**
    
    **Using `serve` (recommended):**
    ```sh
    # Install serve if you don't have it
    npm install -g serve
    
    # Run the server from the project root
    serve .
    ```

    **Using Python:**
    ```sh
    # For Python 3
    python -m http.server
    ```

4.  **Open the application** in your browser. If you used `serve`, it's likely at `http://localhost:3000`. For the Python server, it's typically `http://localhost:8000`.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

*(A `LICENSE` file should be added to the repository.)*

## ⚠️ Disclaimer

This is a technology demonstration and is **not a substitute for professional medical advice, diagnosis, or treatment**. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
