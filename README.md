# MindMate 🧠

A modern, AI-powered mental wellness companion to help you track your mood, build healthy habits, and stay motivated—every day.

---

## ✨ What is MindMate?

**MindMate** is your personal mental wellness platform. It combines science-backed mood tracking, personalized self-care activities, gamified tasks, and a supportive community—all in a beautiful, modern web app. With AI-driven recommendations and analytics, MindMate helps you understand your emotions, build positive routines, and connect with others on your wellness journey.

---

## 🚀 Live Demo

- **Frontend:** [https://mind-mate-zeta.vercel.app/](https://mind-mate-zeta.vercel.app/)
- **Backend (API):** [https://mindmate-dspm.onrender.com](https://mindmate-dspm.onrender.com)

---

## 🧩 Key Features

- **User Registration & Login:** Secure authentication with JWT and bcrypt
- **Mood Tracking:** Log your mood daily, add notes, and visualize trends
- **AI-Powered Recommendations:** Get personalized self-care activities and tasks based on your mood and habits
- **Gamified Tasks:** Complete mood-based tasks to earn points, level up, and maintain streaks
- **Leaderboard:** See how you rank in the community by points, level, and streak
- **Community Support:** Anonymous peer support and weekly challenges
- **Profile & Privacy:** Manage your data, privacy, and export options
- **Modern UI:** Responsive, glassmorphic design with smooth transitions
- **Landing Page:** Beautiful, animated landing page with feature highlights

---

## 🤖 AI Usage in MindMate

- **Personalized Recommendations:**
  - AI logic suggests activities and tasks tailored to your current mood, time of day, and recent history.
- **Mood Analytics:**
  - AI-driven insights help you spot trends and patterns in your mood data.
- **Future Expansion:**
  - The architecture supports adding LLM-powered chat, smart journaling, and more advanced AI features.

---

## 🖥️ Screenshots

> _Add screenshots or GIFs here if available._

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Node.js (v14+)
- npm

### 1. Clone the Repository
```sh
git clone https://github.com/arpitsehal/MindMate.git
cd MindMate
```

### 2. Backend Setup
```sh
cd mindmate/server
npm install
npm start
# or for development
yarn dev
```
- The backend runs at [http://localhost:5000](http://localhost:5000)
- A `users.db` SQLite file is created automatically
- To set a custom JWT secret, create `.env` in `mindmate/server/`:
  ```env
  JWT_SECRET=your-super-secret-jwt-key
  PORT=5000
  ```

### 3. Frontend Setup
```sh
cd ../src
npm install
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start
```
- The frontend runs at [http://localhost:3000](http://localhost:3000)

---

## 🗺️ How to Use MindMate

1. **Visit the landing page** and explore features, testimonials, and FAQs
2. **Register or log in** to your account
3. **Track your mood** daily and add notes
4. **Get AI-powered activity recommendations** based on your mood
5. **Complete tasks** to earn points, level up, and maintain streaks
6. **View your progress** in the dashboard and mood trends
7. **Join the leaderboard** and see how you rank in the community
8. **Connect with others** in the community support section
9. **Manage your profile and privacy** settings

---

## 🧠 Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide React, React Router
- **Backend:** Node.js, Express, SQLite
- **AI/Logic:** Custom AI logic for recommendations and analytics
- **Other:** JWT, bcrypt, Axios

---

## 🔗 API Endpoints (Summary)

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile (protected)
- `POST /api/auth/update-activity` — Update points/streak
- `GET /api/auth/leaderboard` — Get leaderboard
- `POST /api/auth/mood` — Add mood entry
- `GET /api/auth/mood` — Get mood history
- `GET /api/health` — Server health check

---

## 🗂️ Project Structure
```
MindMate/
├── mindmate/
│   ├── src/           # React frontend
│   ├── server/        # Node.js backend
│   ├── public/        # Static assets
│   └── ...
├── README.md          # This file
```

---

## 🧩 Troubleshooting & FAQ
- Make sure both frontend and backend servers are running
- Check CORS errors in browser console
- If you have auth issues, clear browser storage
- For DB issues, check file permissions in `server/`
- For help, open an issue or contact the maintainer

---

## 👤 Author & Contact

**Arpit Sehal**  
- [LinkedIn](https://www.linkedin.com/in/arpitsehal/) ([www.linkedin.com/in/arpitsehal](https://www.linkedin.com/in/arpitsehal/))  
- Email: [2005sehalarpit@gmail.com](mailto:2005sehalarpit@gmail.com)  
- [GitHub](https://github.com/arpitsehal)

---

## 📄 License

This project is licensed under the MIT License.

---

Enjoy using MindMate! 💙 
