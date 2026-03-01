# FitAI — AI Personal Fitness for Everyone

FitAI is a premium, AI-powered personal fitness platform designed to provide a seamless, high-quality experience for tracking workouts, managing nutrition, and receiving intelligent coaching.

Built with a modern tech stack and focusing on premium aesthetics, FitAI offers:
- **Intelligent AI Coach**: Personalized responses using Gemini 1.5 Flash.
- **Smart Nutrition Planning**: Calorie and macro targets tailored to your goals and medical conditions.
- **Workout Programs**: Modular training plans designed for your fitness level.
- **Recovery & Wellness**: Tracking for vitals, sleep, and soreness to optimize recovery.
- **Premium Design System**: Soft rounded glassmorphism, floating navigation, and airy layouts.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **MySQL** (Local or Remote)
- **Google Gemini API Key**

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file from the template:
```bash
# Example .env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/fitness
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173
```
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
python -m uvicorn app.main:app --reload
```

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS** (Custom Design Tokens)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Recharts** (Progress Visualization)

### Backend
- **FastAPI**
- **SQLAlchemy** (ORM)
- **Pydantic** (Validation)
- **MySQL** (Database)
- **Gemini 1.5 Flash** (AI Engine)

---

## 🌟 Key Features
- **Medical Intelligence**: AI Coach respects your medical conditions (e.g., gastric problems) and adjusts dietary advice accordingly.
- **Dynamic Stats**: Real-time BMI, BMR, and TDEE calculations.
- **Multi-step Onboarding**: A smooth, glassmorphic registration flow.
- **Mobile Responsive**: Fully optimized for all screen sizes.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
