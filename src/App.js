import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Activity, Users, Settings, Trophy, Star, Moon, Sun, Brain, Smile, Meh, Frown, BookOpen, Wind, Headphones, MessageCircle, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";

const MindMate = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'Alex',
    streak: 7,
    level: 3,
    points: 250,
    mood: null,
    dailyGoals: []
  });
  function App() {
  return <AuthPage />;
}
  function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem('authToken');
  return isAuth ? children : <Navigate to="/login" replace />;
}


  const [moodHistory, setMoodHistory] = useState([
    { date: '2025-06-16', mood: 4, note: 'Great day at work!' },
    { date: '2025-06-17', mood: 3, note: 'Feeling okay' },
    { date: '2025-06-18', mood: 5, note: 'Amazing weekend!' },
    { date: '2025-06-19', mood: 2, note: 'Stressed about deadlines' },
    { date: '2025-06-20', mood: 4, note: 'Much better today' },
    { date: '2025-06-21', mood: 4, note: 'Productive day' }
  ]);

  const [activities] = useState([
    { id: 1, type: 'breathing', title: '5-Minute Breathing Exercise', duration: '5 min', icon: Wind, points: 10 },
    { id: 2, type: 'journal', title: 'Gratitude Journaling', duration: '10 min', icon: BookOpen, points: 15 },
    { id: 3, type: 'meditation', title: 'Mindfulness Meditation', duration: '15 min', icon: Brain, points: 20 },
    { id: 4, type: 'music', title: 'Calming Music Therapy', duration: '20 min', icon: Headphones, points: 10 }
  ]);

  const [completedToday, setCompletedToday] = useState(new Set());
  const [todayMood, setTodayMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'bg-red-500' },
    { value: 2, emoji: '😞', label: 'Sad', color: 'bg-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
    { value: 4, emoji: '😊', label: 'Happy', color: 'bg-green-500' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: 'bg-emerald-500' }
  ];

  const handleMoodSubmit = () => {
    if (todayMood) {
      const today = new Date().toISOString().split('T')[0];
      const newEntry = { date: today, mood: todayMood, note: moodNote };
      setMoodHistory(prev => [...prev.filter(entry => entry.date !== today), newEntry]);
      setUser(prev => ({ ...prev, points: prev.points + 5 }));
      setTodayMood(null);
      setMoodNote('');
    }
  };

  const completeActivity = (activityId) => {
    if (!completedToday.has(activityId)) {
      setCompletedToday(prev => new Set([...prev, activityId]));
      const activity = activities.find(a => a.id === activityId);
      setUser(prev => ({ 
        ...prev, 
        points: prev.points + activity.points,
        streak: prev.streak + (Math.random() > 0.7 ? 1 : 0)
      }));
    }
  };

  const getRecommendedActivities = () => {
    const lastMood = moodHistory[moodHistory.length - 1]?.mood || 3;
    if (lastMood <= 2) {
      return activities.filter(a => ['breathing', 'meditation'].includes(a.type));
    } else if (lastMood === 3) {
      return activities.filter(a => ['journal', 'music'].includes(a.type));
    }
    return activities.slice(0, 2);
  };

  const NavButton = ({ view, icon: Icon, label, active }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
  

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-300" size={16} />
            <span>{user.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-300" size={16} />
            <span>{user.points} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-300" size={16} />
            <span>Level {user.level}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="mr-2 text-red-500" size={20} />
            Quick Mood Check-in
          </h3>
          {!todayMood ? (
            <div className="space-y-4">
              <p className="text-gray-600">How are you feeling today?</p>
              <div className="flex space-x-2">
                {moods.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setTodayMood(mood.value)}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors text-2xl"
                    title={mood.label}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
              {todayMood && (
                <div className="space-y-3">
                  <textarea
                    placeholder="Add a note about your mood (optional)"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleMoodSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Mood
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">{moods.find(m => m.value === todayMood)?.emoji}</div>
              <p className="text-gray-600">Mood logged for today!</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-green-500" size={20} />
            Recommended Activities
          </h3>
          <div className="space-y-3">
            {getRecommendedActivities().map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <activity.icon size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => completeActivity(activity.id)}
                  disabled={completedToday.has(activity.id)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    completedToday.has(activity.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {completedToday.has(activity.id) ? 'Done!' : `+${activity.points}pts`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
        <div className="flex items-end space-x-2 h-32">
          {moodHistory.slice(-7).map((entry, index) => {
            const height = (entry.mood / 5) * 100;
            const mood = moods.find(m => m.value === entry.mood);
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${mood.color} rounded-t-lg transition-all hover:opacity-80`}
                  style={{ height: `${height}%` }}
                  title={`${entry.date}: ${mood.label}${entry.note ? ` - ${entry.note}` : ''}`}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(entry.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const Activities = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Self-Care Activities</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <activity.icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{activity.title}</h3>
                  <p className="text-sm text-gray-500">{activity.duration}</p>
                </div>
              </div>
              {completedToday.has(activity.id) && (
                <CheckCircle size={20} className="text-green-500" />
              )}
            </div>
            
            <div className="space-y-3">
              {activity.type === 'breathing' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Follow this simple breathing pattern:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Inhale for 4 counts</li>
                    <li>• Hold for 4 counts</li>
                    <li>• Exhale for 6 counts</li>
                    <li>• Repeat 5-10 times</li>
                  </ul>
                </div>
              )}
              
              {activity.type === 'journal' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Today's prompts:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Three things I'm grateful for today</li>
                    <li>• One positive moment from this week</li>
                    <li>• A goal I'm working towards</li>
                  </ul>
                </div>
              )}
              
              {activity.type === 'meditation' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Guided meditation steps:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Find a comfortable position</li>
                    <li>• Focus on your breath</li>
                    <li>• Notice thoughts without judgment</li>
                    <li>• Return attention to breathing</li>
                  </ul>
                </div>
              )}
              
              {activity.type === 'music' && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Recommended genres:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Nature sounds & ambient</li>
                    <li>• Classical & instrumental</li>
                    <li>• Lo-fi & chill beats</li>
                    <li>• Meditation music</li>
                  </ul>
                </div>
              )}
              
              <button
                onClick={() => completeActivity(activity.id)}
                disabled={completedToday.has(activity.id)}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  completedToday.has(activity.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {completedToday.has(activity.id) ? 'Completed Today!' : `Start Activity (+${activity.points} pts)`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Community = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community Support</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Anonymous Peer Support</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Connect with others on similar journeys. Share experiences, offer support, and find encouragement in our safe, moderated community space.
          </p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Join Community Chat
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-3 flex items-center">
            <MessageCircle className="mr-2 text-green-500" size={20} />
            Daily Inspiration
          </h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-700 italic">
              "Progress, not perfection. Every small step forward is a victory worth celebrating."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Community Member</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-3 flex items-center">
            <Target className="mr-2 text-purple-500" size={20} />
            Weekly Challenge
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Mindful Moments</p>
            <p className="text-sm text-gray-600 mt-1">
              Take 5 mindful minutes each day this week. Notice your surroundings, breathe deeply, and be present.
            </p>
            <button className="mt-2 text-purple-600 text-sm font-medium">Join Challenge</button>
          </div>
        </div>
      </div>
    </div>
  );

  const Profile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-600">Level {user.level} • {user.points} points</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedToday.size}</div>
            <div className="text-sm text-gray-600">Activities Today</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{moodHistory.length}</div>
            <div className="text-sm text-gray-600">Mood Entries</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold mb-4">Privacy & Data</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Your mood data is stored locally and never shared</p>
          <p>• Community interactions are anonymous by default</p>
          <p>• You can export or delete your data anytime</p>
          <p>• All activities and recommendations are personalized to you</p>
        </div>
        <button className="mt-4 text-blue-600 text-sm font-medium">Manage Privacy Settings</button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch(currentView) {
      case 'activities': return <Activities />;
      case 'community': return <Community />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">MindMate</h1>
            </div>
            <nav className="flex space-x-2">
              <NavButton view="dashboard" icon={Calendar} label="Dashboard" active={currentView === 'dashboard'} />
              <NavButton view="activities" icon={Activity} label="Activities" active={currentView === 'activities'} />
              <NavButton view="community" icon={Users} label="Community" active={currentView === 'community'} />
              <NavButton view="profile" icon={Settings} label="Profile" active={currentView === 'profile'} />
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>

      <footer className="bg-gray-100 border-t mt-12">
  <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Brand & Description */}
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-blue-600">MindMate</h2>
      <p className="text-gray-600 text-sm">
        Your personal mental health companion—take care of your mind, one day at a time 💙
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
      <ul className="space-y-1 text-gray-600 text-sm">
        <li><a href="/" className="hover:text-blue-600 transition">Dashboard</a></li>
        <li><a href="/activities" className="hover:text-blue-600 transition">Activities</a></li>
        <li><a href="/community" className="hover:text-blue-600 transition">Community</a></li>
        <li><a href="/profile" className="hover:text-blue-600 transition">Profile</a></li>
        <li><a href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</a></li>
      </ul>
    </div>

    {/* Subscribe & Social */}
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Stay Updated</h3>
      <form className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="email"
          placeholder="Your email"
          aria-label="Subscribe to newsletter"
          className="w-full sm:flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Subscribe
        </button>
      </form>
      <div className="flex space-x-4 mt-2">
        {/* Example icons - replace with your social SVGs */}
        <a href="https://x.com/_axpiit" aria-label="Twitter" className="text-gray-500 hover:text-blue-600"><svg
      className="w-6 h-6 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 521.949 521.949"
    >
      <path d="M459.4 151.7c.3 4.5.3 9.1.3
               13.6 0 138.7-105.6 298.6-298.6
               298.6-59.5 0-114.7-17.2-161.1-47.1
               8.4 1 16.6 1.3 25.3 1.3 49.1 0
               94.2-16.6 130.3-44.8-46.1-1-84.8-31.2
               -98.1-72.8 6.5 1 13 1.6 19.8 1.6
               9.4 0 18.8-1.3 27.6-3.6-48.1-9.7
               -84.1-52-84.1-103v-1.3c14 7.8
               30.2 12.7 47.4 13.3-28.3-18.8
               -46.8-51-46.8-87.4 0-19.5
               5.2-37.4 14.3-53 51.7 63.7
               129.3 105.3 216.4 109.8-1.6
               -7.8-2.6-15.9-2.6-24 0-57.8
               46.8-104.9 104.9-104.9
               30.2 0 57.5 12.7 76.7 33.1
               23.7-4.5 46.5-13.3 66.6-25.3z"/>
    </svg>
  </a>

        <a href="https://www.instagram.com/sehal_arpit?igsh=NGthcG9jeGEyczVt" aria-label="Instagram" className="text-gray-500 hover:text-blue-600"><svg
      className="w-6 h-6 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.06
           1.064.049 1.791.218 2.427.465a4.902
           4.902 0 011.772 1.153 4.902 4.902 0
           011.153 1.772c.247.636.416 1.363.465
           2.427.048 1.067.06 1.407.06 4.123v.08
           c0 2.643-.012 2.987-.06 4.043-.049
           1.064-.218 1.791-.465 2.427a4.902
           4.902 0 01-1.153 1.772 4.902
           4.902 0 01-1.772 1.153c-.636.247-1.363
           .416-2.427.465-1.067.048-1.407.06
           -4.123.06h-.08c-2.643 0-2.987
           -.012-4.043-.06-1.064-.049-1.791
           -.218-2.427-.465a4.902 4.902 0
           01-1.772-1.153 4.902 4.902 0
           01-1.153-1.772c-.247-.636-.416
           -1.363-.465-2.427-.048-1.055
           -.06-1.37-.06-4.041v-.08c0
           -2.597.01-2.917.058-3.96a4.902
           4.902 0 01.465-2.427 4.902 4.902 0
           011.153-1.772 4.902 4.902 0
           011.772-1.153c.636-.247 1.363
           -.416 2.427-.465C8.901 2.013
           9.256 2 11.685 2h.63zM12 5.838a6.162
           6.162 0 100 12.324 6.162 6.162 0 000
           -12.324zm0 10.162a3.999 3.999 0
           110-7.998 3.999 3.999 0 010 7.998zm6.406
           -11.845a1.44 1.44 0 11-2.88 0 1.44
           1.44 0 012.88 0z"/>
    </svg>
  </a>
  {/* GitHub */}
  <a
    href="https://github.com/arpitsehal"
    aria-label="GitHub"
    className="text-gray-500 hover:text-gray-900"
  >
    <svg
      className="w-6 h-6 fill-current"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M12 .297a12 12 0 00-3.79 23.4c.6.112.82-.26.82-.577
           0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.61-4.042-1.61
           -.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.084-.729.084-.729
           1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998
           .108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.335-5.466-5.93
           0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176
           0 0 1.008-.323 3.301 1.23a11.49 11.49 0 013.005-.404
           c1.02.005 2.045.138 3.005.404 2.29-1.553 3.297-1.23 3.297-1.23
           .653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22
           0 4.61-2.804 5.625-5.475 5.92.43.37.815 1.096.815 2.21
           0 1.595-.015 2.88-.015 3.27 0 .32.217.694.825.576A12.005 12.005 0 0012 .297"
        clipRule="evenodd"
      />
    </svg>
  </a>
      </div>
    </div>
  </div>

  <div className="border-t py-4">
    <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-xs">
      © {new Date().getFullYear()} MindMate. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
};

export default MindMate;