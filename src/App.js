import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Activity, Users, Settings, Trophy, Star, Brain, Smile, BookOpen, Wind, MessageCircle, Target, CheckCircle, TrendingUp, Coffee, Music, Lightbulb, Zap, Feather, Mountain, Palette, Utensils, Bed, Sunrise, Sunset, Phone, HelpCircle, Mail, Bell, Award, Crown, Info, Github, Linkedin, Twitter, Globe, Code, Palette as PaletteIcon, Database, Server, Zap as ZapIcon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { authAPI } from './services/api';
import './components/AppModern.css';

const MindMate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [moodHistory, setMoodHistory] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  
  // Initialize completedToday and completedTasks with proper state management
  const [completedToday, setCompletedToday] = useState(new Set());
  const [completedTasks, setCompletedTasks] = useState([]);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // Move activities useState here
  const [activities] = useState([
    // Low mood activities (mood 1-2)
    { id: 1, type: 'breathing', title: '5-Minute Breathing Exercise', duration: '5 min', icon: Wind, points: 10, moodRange: [1, 2], category: 'calming', description: 'Simple breathing to help you feel more centered' },
    { id: 2, type: 'gentle_music', title: 'Soothing Music Session', duration: '10 min', icon: Music, points: 15, moodRange: [1, 2], category: 'calming', description: 'Listen to calming instrumental music' },
    { id: 3, type: 'warm_drink', title: 'Warm Comfort Drink', duration: '5 min', icon: Coffee, points: 5, moodRange: [1, 2], category: 'comfort', description: 'Make yourself a warm tea or hot chocolate' },
    { id: 4, type: 'gentle_stretch', title: 'Gentle Stretching', duration: '8 min', icon: Feather, points: 12, moodRange: [1, 2], category: 'movement', description: 'Simple stretches to release tension' },
    
    // Neutral mood activities (mood 3)
    { id: 5, type: 'journal', title: 'Gratitude Journaling', duration: '10 min', icon: BookOpen, points: 15, moodRange: [3], category: 'reflection', description: 'Write about things you appreciate' },
    { id: 6, type: 'nature_walk', title: 'Short Nature Walk', duration: '15 min', icon: Mountain, points: 20, moodRange: [3], category: 'movement', description: 'Take a walk outside and notice nature' },
    { id: 7, type: 'creative_time', title: 'Creative Expression', duration: '20 min', icon: Palette, points: 18, moodRange: [3], category: 'creative', description: 'Draw, paint, or create something' },
    { id: 8, type: 'mindful_break', title: 'Mindful Coffee Break', duration: '10 min', icon: Coffee, points: 10, moodRange: [3], category: 'mindfulness', description: 'Enjoy your drink mindfully' },
    
    // High mood activities (mood 4-5)
    { id: 9, type: 'meditation', title: 'Mindfulness Meditation', duration: '15 min', icon: Brain, points: 20, moodRange: [4, 5], category: 'mindfulness', description: 'Deep meditation practice' },
    { id: 10, type: 'energetic_music', title: 'Upbeat Music Session', duration: '15 min', icon: Music, points: 15, moodRange: [4, 5], category: 'energy', description: 'Listen to your favorite upbeat songs' },
    { id: 11, type: 'dance_break', title: 'Dance Break', duration: '10 min', icon: Zap, points: 25, moodRange: [4, 5], category: 'movement', description: 'Dance to your favorite music' },
    { id: 12, type: 'goal_planning', title: 'Goal Planning Session', duration: '20 min', icon: Target, points: 30, moodRange: [4, 5], category: 'productivity', description: 'Plan your next big goals' },
    
    // Universal activities (all moods)
    { id: 13, type: 'hydration', title: 'Hydration Check', duration: '2 min', icon: Coffee, points: 5, moodRange: [1, 2, 3, 4, 5], category: 'health', description: 'Drink a glass of water' },
    { id: 14, type: 'posture_check', title: 'Posture Reset', duration: '3 min', icon: Activity, points: 8, moodRange: [1, 2, 3, 4, 5], category: 'health', description: 'Check and correct your posture' },
    { id: 15, type: 'gratitude_thought', title: 'Quick Gratitude', duration: '2 min', icon: Heart, points: 5, moodRange: [1, 2, 3, 4, 5], category: 'reflection', description: 'Think of one thing you\'re grateful for' },
    
    // Time-based activities
    { id: 16, type: 'morning_routine', title: 'Morning Energy Boost', duration: '10 min', icon: Sunrise, points: 20, moodRange: [1, 2, 3, 4, 5], category: 'routine', description: 'Start your day with energy', timeBased: 'morning' },
    { id: 17, type: 'evening_wind_down', title: 'Evening Wind Down', duration: '15 min', icon: Sunset, points: 15, moodRange: [1, 2, 3, 4, 5], category: 'routine', description: 'Prepare for restful sleep', timeBased: 'evening' },
    { id: 18, type: 'lunch_break', title: 'Mindful Lunch Break', duration: '20 min', icon: Utensils, points: 12, moodRange: [1, 2, 3, 4, 5], category: 'routine', description: 'Enjoy your meal mindfully', timeBased: 'lunch' },
    { id: 19, type: 'bedtime_routine', title: 'Bedtime Relaxation', duration: '10 min', icon: Bed, points: 15, moodRange: [1, 2, 3, 4, 5], category: 'routine', description: 'Prepare for sleep', timeBased: 'bedtime' }
  ]);

  useEffect(() => {
    async function validateTokenAndFetchUser() {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.validateToken();
        if (res.valid) {
          setUser(res.user);
          // Load completed tasks from backend
          const tasksRes = await authAPI.getCompletedTasks();
          if (tasksRes && Array.isArray(tasksRes.completed_tasks)) {
            setCompletedTasks(tasksRes.completed_tasks);
          }
        } else {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Token validation failed:', err);
        // Fallback: try to get user from storage
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    }

    validateTokenAndFetchUser();
  }, []);

  // Fetch mood history from backend on mount
  useEffect(() => {
    async function fetchMoodHistory() {
      try {
        const res = await authAPI.getMoodHistory(30);
        if (res && Array.isArray(res.mood_history)) {
          setMoodHistory(res.mood_history.reverse());
        }
      } catch (err) {
        console.error('Failed to fetch mood history:', err);
      }
    }
    fetchMoodHistory();
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      if (!user) return;
      setLeaderboardLoading(true);
      try {
        const res = await authAPI.getLeaderboard();
        if (res && Array.isArray(res.leaderboard)) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLeaderboardLoading(false);
      }
    }
    fetchLeaderboard();
  }, [user]);

  // Reset completedToday and completedTasks at midnight
  useEffect(() => {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
    const timer = setTimeout(() => {
      setCompletedToday(new Set());
      setCompletedTasks([]);
      localStorage.setItem('completedToday', JSON.stringify([]));
      localStorage.setItem('completedTodayDate', getTodayDateString());
      localStorage.setItem('completedTasks', JSON.stringify([]));
      localStorage.setItem('completedTasksDate', getTodayDateString());
      // Sync with backend
      authAPI.updateCompletedTasks([]);
    }, msUntilMidnight);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'bg-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { value: 2, emoji: '😞', label: 'Sad', color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { value: 4, emoji: '😊', label: 'Happy', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: 'bg-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' }
  ];

  const handleMoodSubmit = async () => {
    if (todayMood) {
      try {
        // Save mood to backend
        await authAPI.addMoodEntry(todayMood, moodNote);
        // Refresh mood history from backend
        const res = await authAPI.getMoodHistory(30);
        if (res && Array.isArray(res.mood_history)) {
          setMoodHistory(res.mood_history.reverse());
        }
        // Call backend to update points (e.g., +5 for mood submit)
        const activityRes = await authAPI.updateActivity(5);
        setUser(prev => ({
          ...prev,
          points: activityRes.points,
          streak: activityRes.streak,
          level: activityRes.level
        }));
      } catch (err) {
        console.error('Failed to submit mood:', err);
      }
      setTodayMood(null);
      setMoodNote('');
    }
  };

  const completeActivity = async (activityId) => {
    if (!completedToday.has(activityId)) {
      const newSet = new Set([...completedToday, activityId]);
      setCompletedToday(newSet);
      // Persist to localStorage
      localStorage.setItem('completedToday', JSON.stringify(Array.from(newSet)));
      localStorage.setItem('completedTodayDate', getTodayDateString());
      const activity = activities.find(a => a.id === activityId);
      try {
        // Call backend to update points and streak
        const res = await authAPI.updateActivity(activity.points);
        setUser(prev => ({
          ...prev,
          points: res.points,
          streak: res.streak,
          level: res.level
        }));
      } catch (err) {
        console.error('Failed to update activity:', err);
      }
    }
  };

  // Enhanced mood-based activity recommendations
  const getRecommendedActivities = () => {
    const currentMood = todayMood || moodHistory[moodHistory.length - 1]?.mood || 3;
    const currentHour = new Date().getHours();
    
    // Filter activities based on current mood and time
    let recommended = activities.filter(activity => {
      const moodMatch = activity.moodRange.includes(currentMood);
      
      if (activity.timeBased) {
        const timeMatch = 
          (activity.timeBased === 'morning' && currentHour >= 6 && currentHour <= 10) ||
          (activity.timeBased === 'lunch' && currentHour >= 11 && currentHour <= 14) ||
          (activity.timeBased === 'evening' && currentHour >= 17 && currentHour <= 20) ||
          (activity.timeBased === 'bedtime' && (currentHour >= 21 || currentHour <= 5));
        
        return moodMatch && timeMatch;
      }
      
      return moodMatch;
    });
    
    // Add some universal activities
    const universal = activities.filter(a => a.moodRange.length === 5 && !a.timeBased).slice(0, 2);
    
    return [...recommended.slice(0, 4), ...universal];
  };

  const getMoodBasedTasks = () => {
    const currentMood = todayMood || moodHistory[moodHistory.length - 1]?.mood || 3;
    
    const moodTasks = {
      1: [
        { title: 'Be extra gentle with yourself today', icon: Heart, color: 'text-red-500' },
        { title: 'Focus on basic self-care', icon: Coffee, color: 'text-orange-500' },
        { title: 'Avoid overwhelming yourself', icon: Feather, color: 'text-blue-500' }
      ],
      2: [
        { title: 'Take things one step at a time', icon: Target, color: 'text-orange-500' },
        { title: 'Connect with someone you trust', icon: MessageCircle, color: 'text-green-500' },
        { title: 'Do something that usually brings you comfort', icon: Heart, color: 'text-red-500' }
      ],
      3: [
        { title: 'Try something new today', icon: Lightbulb, color: 'text-yellow-500' },
        { title: 'Balance rest and activity', icon: Activity, color: 'text-blue-500' },
        { title: 'Notice what brings you small moments of joy', icon: Smile, color: 'text-green-500' }
      ],
      4: [
        { title: 'Channel your positive energy into goals', icon: Target, color: 'text-green-500' },
        { title: 'Share your good mood with others', icon: Users, color: 'text-blue-500' },
        { title: 'Try something challenging but fun', icon: Zap, color: 'text-purple-500' }
      ],
      5: [
        { title: 'Make the most of this amazing energy!', icon: Star, color: 'text-yellow-500' },
        { title: 'Help someone else feel good too', icon: Heart, color: 'text-red-500' },
        { title: 'Plan something exciting for the future', icon: Calendar, color: 'text-blue-500' }
      ]
    };
    
    return moodTasks[currentMood] || moodTasks[3];
  };

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const NavButton = ({ view, icon: Icon, label, active }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
        active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      <Icon size={20} className={`transition-transform duration-300 ${active ? 'animate-pulse' : ''}`} />
      <span className="font-medium">{label}</span>
    </button>
  );
  

  const Dashboard = () => {
    const currentMood = todayMood || moodHistory[moodHistory.length - 1]?.mood || 3;
    const moodInfo = moods.find(m => m.value === currentMood);
    const timeOfDay = getCurrentTimeOfDay();
    const moodTasks = getMoodBasedTasks();
    
    // Handle user name properly - user might have first_name and last_name or name
    const userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
    
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg hover:scale-105">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}! 👋</h2>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-300 animate-pulse" size={16} />
              <span>{user.streak || 0} day streak</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-300 animate-pulse" size={16} />
              <span>{user.points || 0} points</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-300 animate-pulse" size={16} />
              <span>Level {user.level || 0}</span>
            </div>
          </div>
        </div>

        {/* Current Mood Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:scale-105" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="mr-2 text-red-500 animate-pulse" size={20} />
            Current Mood Status
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl animate-pulse">{moodInfo?.emoji}</div>
            <div>
              <p className="font-medium">{moodInfo?.label}</p>
              <p className="text-sm text-gray-500">Good {timeOfDay}!</p>
            </div>
          </div>

          {!todayMood ? (
            <div className="space-y-4">
              <p className="text-gray-600">How are you feeling right now?</p>
              <div className="flex space-x-2">
                {moods.map((mood, index) => (
                  <button
                    key={mood.value}
                    onClick={() => setTodayMood(mood.value)}
                    className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 text-2xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                    className="w-full p-3 border rounded-lg resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-sm"
                    rows={2}
                  />
                  <button
                    onClick={handleMoodSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Mood
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-2 animate-bounce">{moods.find(m => m.value === todayMood)?.emoji}</div>
              <p className="text-gray-600">Mood logged for today!</p>
            </div>
          )}
        </div>

        {/* Mood-Based Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:scale-105" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="mr-2 text-purple-500 animate-pulse" size={20} />
            Mood-Based Focus Areas
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {moodTasks.map((task, index) => (
              <div key={index} className={`p-4 rounded-lg border ${moodInfo?.bgColor} ${moodInfo?.borderColor} transition-all duration-300 transform hover:scale-105 hover:shadow-md`} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="flex items-center space-x-3">
                  <task.icon size={20} className={`${task.color} transition-transform duration-300 hover:scale-110`} />
                  <p className="text-sm font-medium text-gray-700">{task.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md hover:scale-105" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-green-500 animate-pulse" size={20} />
            Recommended Activities for Your Mood
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {getRecommendedActivities().map((activity, index) => (
              <div key={activity.id} className={`p-4 rounded-lg border ${moodInfo?.bgColor} ${moodInfo?.borderColor} transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-slideIn`} style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <activity.icon size={20} className="text-blue-600 transition-transform duration-300 hover:scale-110" />
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.duration} • {activity.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => completeActivity(activity.id)}
                    disabled={completedToday.has(activity.id)}
                    className={`w-full py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
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

        {/* Mood Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md hover:scale-105" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold mb-4">Your Mood Trends</h3>
          <div className="flex items-end space-x-2 h-32">
            {moodHistory.slice(-7).map((entry, index) => {
              const height = (entry.mood / 5) * 100;
              const mood = moods.find(m => m.value === entry.mood);
              return (
                <div key={index} className="flex-1 flex flex-col items-center animate-slideIn" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
                  <div
                    className={`w-full ${mood.color} rounded-t-lg transition-all duration-500 hover:opacity-80 transform hover:scale-105`}
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
  };

  const Activities = () => {
    const currentMood = todayMood || moodHistory[moodHistory.length - 1]?.mood || 3;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMood, setSelectedMood] = useState(currentMood);
    
    const categories = [
      { id: 'all', name: 'All Activities', icon: Activity },
      { id: 'calming', name: 'Calming', icon: Feather },
      { id: 'movement', name: 'Movement', icon: Mountain },
      { id: 'mindfulness', name: 'Mindfulness', icon: Brain },
      { id: 'creative', name: 'Creative', icon: Palette },
      { id: 'energy', name: 'Energy', icon: Zap },
      { id: 'health', name: 'Health', icon: Heart },
      { id: 'routine', name: 'Daily Routine', icon: Calendar }
    ];

    const filteredActivities = activities.filter(activity => {
      const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;
      const moodMatch = selectedMood === 'all' || activity.moodRange.includes(selectedMood);
      return (categoryMatch && moodMatch);
    });

    const getMoodLabel = (moodValue) => {
      return moods.find(m => m.value === moodValue)?.label || 'All Moods';
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 animate-slideIn">
          <h2 className="text-2xl font-bold">Self-Care Activities</h2>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm transition-all duration-300 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(parseInt(e.target.value) || 'all')}
              className="px-3 py-2 border rounded-lg text-sm transition-all duration-300 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Moods</option>
              {moods.map(mood => (
                <option key={mood.value} value={mood.value}>{mood.emoji} {mood.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Mood Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 animate-scaleIn">
          <div className="flex items-center space-x-3">
            <div className="text-2xl animate-pulse">{moods.find(m => m.value === currentMood)?.emoji}</div>
            <div>
              <p className="font-medium">Based on your current mood: <span className="text-blue-600">{getMoodLabel(currentMood)}</span></p>
              <p className="text-sm text-gray-600">These activities are tailored to help you feel better</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredActivities.map((activity, index) => {
            const moodInfo = moods.find(m => m.value === currentMood);
            const isRecommended = activity.moodRange.includes(currentMood);
            
            return (
              <div 
                key={activity.id} 
                className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-slideIn ${
                  isRecommended ? `${moodInfo?.bgColor} ${moodInfo?.borderColor}` : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
                      isRecommended ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <activity.icon size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{activity.title}</h3>
                        {isRecommended && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full animate-pulse">Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{activity.duration} • {activity.category}</p>
                      <p className="text-xs text-gray-400">{activity.description}</p>
                    </div>
                  </div>
                  {completedToday.has(activity.id) && (
                    <CheckCircle size={20} className="text-green-500 animate-bounce" />
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Mood indicators */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Best for:</span>
                    <div className="flex space-x-1">
                      {activity.moodRange.map(moodValue => {
                        const mood = moods.find(m => m.value === moodValue);
                        return (
                          <span key={moodValue} className="text-sm transition-transform duration-300 hover:scale-110" title={mood?.label}>
                            {mood?.emoji}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity-specific content */}
                  {activity.type === 'breathing' && (
                    <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
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
                    <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:bg-green-100">
                      <p className="text-sm text-gray-700 mb-2">Today's prompts:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Three things I'm grateful for today</li>
                        <li>• One positive moment from this week</li>
                        <li>• A goal I'm working towards</li>
                      </ul>
                    </div>
                  )}
                  
                  {activity.type === 'meditation' && (
                    <div className="bg-purple-50 p-4 rounded-lg transition-all duration-300 hover:bg-purple-100">
                      <p className="text-sm text-gray-700 mb-2">Guided meditation steps:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Find a comfortable position</li>
                        <li>• Focus on your breath</li>
                        <li>• Notice thoughts without judgment</li>
                        <li>• Return attention to breathing</li>
                      </ul>
                    </div>
                  )}
                  
                  {activity.type === 'gentle_music' && (
                    <div className="bg-indigo-50 p-4 rounded-lg transition-all duration-300 hover:bg-indigo-100">
                      <p className="text-sm text-gray-700 mb-2">Recommended for low mood:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Nature sounds & ambient</li>
                        <li>• Classical & instrumental</li>
                        <li>• Lo-fi & chill beats</li>
                        <li>• Meditation music</li>
                      </ul>
                    </div>
                  )}

                  {activity.type === 'energetic_music' && (
                    <div className="bg-yellow-50 p-4 rounded-lg transition-all duration-300 hover:bg-yellow-100">
                      <p className="text-sm text-gray-700 mb-2">Recommended for high energy:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Your favorite upbeat songs</li>
                        <li>• Dance music</li>
                        <li>• Motivational tracks</li>
                        <li>• Happy playlists</li>
                      </ul>
                    </div>
                  )}

                  {activity.type === 'dance_break' && (
                    <div className="bg-pink-50 p-4 rounded-lg transition-all duration-300 hover:bg-pink-100">
                      <p className="text-sm text-gray-700 mb-2">Dance break tips:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Put on your favorite upbeat music</li>
                        <li>• Move however feels good</li>
                        <li>• Don't worry about looking perfect</li>
                        <li>• Let the music guide your movement</li>
                      </ul>
                    </div>
                  )}

                  {activity.type === 'nature_walk' && (
                    <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:bg-green-100">
                      <p className="text-sm text-gray-700 mb-2">Mindful walking tips:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Notice the sounds around you</li>
                        <li>• Feel the ground beneath your feet</li>
                        <li>• Observe the colors and textures</li>
                        <li>• Take deep breaths of fresh air</li>
                      </ul>
                    </div>
                  )}

                  {activity.type === 'creative_time' && (
                    <div className="bg-purple-50 p-4 rounded-lg transition-all duration-300 hover:bg-purple-100">
                      <p className="text-sm text-gray-700 mb-2">Creative expression ideas:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Draw or paint freely</li>
                        <li>• Write poetry or stories</li>
                        <li>• Make something with your hands</li>
                        <li>• Express your feelings through art</li>
                      </ul>
                    </div>
                  )}

                  {activity.type === 'goal_planning' && (
                    <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                      <p className="text-sm text-gray-700 mb-2">Goal planning steps:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Write down your dreams and aspirations</li>
                        <li>• Break them into smaller steps</li>
                        <li>• Set realistic timelines</li>
                        <li>• Celebrate your progress</li>
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={() => completeActivity(activity.id)}
                    disabled={completedToday.has(activity.id)}
                    className={`w-full py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      completedToday.has(activity.id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {completedToday.has(activity.id) ? 'Completed Today!' : `Start Activity (+${activity.points} pts)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Community = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold animate-slideIn">Community Support</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border animate-scaleIn transition-all duration-300 hover:shadow-md">
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-blue-600 mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Anonymous Peer Support</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Connect with others on similar journeys. Share experiences, offer support, and find encouragement in our safe, moderated community space.
          </p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
            Join Community Chat
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md hover:scale-105" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-semibold mb-3 flex items-center">
            <MessageCircle className="mr-2 text-green-500 animate-pulse" size={20} />
            Daily Inspiration
          </h3>
          <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:bg-green-100">
            <p className="text-gray-700 italic">
              "Progress, not perfection. Every small step forward is a victory worth celebrating."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Community Member</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md hover:scale-105" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold mb-3 flex items-center">
            <Target className="mr-2 text-purple-500 animate-pulse" size={20} />
            Weekly Challenge
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg transition-all duration-300 hover:bg-purple-100">
            <p className="font-medium text-gray-800">Mindful Moments</p>
            <p className="text-sm text-gray-600 mt-1">
              Take 5 mindful minutes each day this week. Notice your surroundings, breathe deeply, and be present.
            </p>
            <button className="mt-2 text-purple-600 text-sm font-medium transition-all duration-300 hover:text-purple-800 hover:scale-105 transform">Join Challenge</button>
          </div>
        </div>
      </div>
    </div>
  );

  const Profile = () => {
    // Handle user name properly - user might have first_name and last_name or name
    const userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold animate-slideIn">Your Profile</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-scaleIn">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold animate-pulse">
              {userInitial}
            </div>
            <div className="animate-slideIn">
              <h3 className="text-xl font-semibold">{userName}</h3>
              <p className="text-gray-600">Level {user.level || 0} • {user.points || 0} points</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-blue-600">{user.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-green-600">{completedToday.size}</div>
              <div className="text-sm text-gray-600">Activities Today</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-purple-600">{moodHistory.length}</div>
              <div className="text-sm text-gray-600">Mood Entries</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn">
          <h3 className="font-semibold mb-4">Privacy & Data</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="transition-all duration-300 hover:text-gray-800">• Your mood data is stored locally and never shared</p>
            <p className="transition-all duration-300 hover:text-gray-800">• Community interactions are anonymous by default</p>
            <p className="transition-all duration-300 hover:text-gray-800">• You can export or delete your data anytime</p>
            <p className="transition-all duration-300 hover:text-gray-800">• All activities and recommendations are personalized to you</p>
          </div>
          <button className="mt-4 text-blue-600 text-sm font-medium transition-all duration-300 hover:text-blue-800 hover:scale-105 transform">Manage Privacy Settings</button>
        </div>
      </div>
    );
  };

  // New Mood-Based Tasks Dashboard
  const Tasks = () => {
    const currentMood = todayMood || moodHistory[moodHistory.length - 1]?.mood || 3;
    const moodInfo = moods.find(m => m.value === currentMood);
    
    // Task categories based on mood
    const getMoodBasedTaskCategories = () => {
      const taskCategories = {
        1: [ // Very Sad
          {
            title: 'Gentle Self-Care',
            description: 'Be kind to yourself today',
            tasks: [
              { title: 'Drink a warm beverage', completed: false, points: 5 },
              { title: 'Wrap yourself in a cozy blanket', completed: false, points: 3 },
              { title: 'Take a warm shower or bath', completed: false, points: 10 },
              { title: 'Listen to calming music', completed: false, points: 8 }
            ],
            color: 'bg-red-50',
            borderColor: 'border-red-200',
            icon: Heart
          },
          {
            title: 'Basic Needs',
            description: 'Focus on fundamental well-being',
            tasks: [
              { title: 'Drink water', completed: false, points: 3 },
              { title: 'Eat something nourishing', completed: false, points: 8 },
              { title: 'Take deep breaths', completed: false, points: 5 },
              { title: 'Rest if you need to', completed: false, points: 5 }
            ],
            color: 'bg-orange-50',
            borderColor: 'border-orange-200',
            icon: Coffee
          }
        ],
        2: [ // Sad
          {
            title: 'Comfort & Connection',
            description: 'Find comfort in familiar things',
            tasks: [
              { title: 'Call or text a friend', completed: false, points: 10 },
              { title: 'Watch a favorite show or movie', completed: false, points: 8 },
              { title: 'Do something that usually brings you joy', completed: false, points: 12 },
              { title: 'Write down your feelings', completed: false, points: 8 }
            ],
            color: 'bg-orange-50',
            borderColor: 'border-orange-200',
            icon: MessageCircle
          },
          {
            title: 'Small Steps Forward',
            description: 'Take it one step at a time',
            tasks: [
              { title: 'Get dressed', completed: false, points: 5 },
              { title: 'Step outside for fresh air', completed: false, points: 8 },
              { title: 'Do one small thing you\'ve been putting off', completed: false, points: 10 },
              { title: 'Practice self-compassion', completed: false, points: 8 }
            ],
            color: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            icon: Target
          }
        ],
        3: [ // Neutral
          {
            title: 'Exploration & Growth',
            description: 'Try something new or different',
            tasks: [
              { title: 'Learn something new (5 minutes)', completed: false, points: 10 },
              { title: 'Try a new recipe or food', completed: false, points: 12 },
              { title: 'Visit a new place (even virtually)', completed: false, points: 15 },
              { title: 'Start a new hobby or project', completed: false, points: 20 }
            ],
            color: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            icon: Lightbulb
          },
          {
            title: 'Balance & Harmony',
            description: 'Find equilibrium in your day',
            tasks: [
              { title: 'Exercise for 15 minutes', completed: false, points: 15 },
              { title: 'Meditate or practice mindfulness', completed: false, points: 12 },
              { title: 'Connect with nature', completed: false, points: 10 },
              { title: 'Express yourself creatively', completed: false, points: 15 }
            ],
            color: 'bg-green-50',
            borderColor: 'border-green-200',
            icon: Activity
          }
        ],
        4: [ // Happy
          {
            title: 'Productivity & Goals',
            description: 'Channel your positive energy',
            tasks: [
              { title: 'Work on a personal goal', completed: false, points: 20 },
              { title: 'Organize or declutter a space', completed: false, points: 15 },
              { title: 'Plan something exciting for the future', completed: false, points: 18 },
              { title: 'Help someone else', completed: false, points: 25 }
            ],
            color: 'bg-green-50',
            borderColor: 'border-green-200',
            icon: Target
          },
          {
            title: 'Connection & Celebration',
            description: 'Share your positive energy',
            tasks: [
              { title: 'Reach out to a friend or family member', completed: false, points: 15 },
              { title: 'Do something fun or playful', completed: false, points: 20 },
              { title: 'Express gratitude to someone', completed: false, points: 18 },
              { title: 'Celebrate a small win', completed: false, points: 12 }
            ],
            color: 'bg-blue-50',
            borderColor: 'border-blue-200',
            icon: Heart
          }
        ],
        5: [ // Very Happy
          {
            title: 'Inspiration & Leadership',
            description: 'Use your energy to inspire others',
            tasks: [
              { title: 'Share something positive with others', completed: false, points: 25 },
              { title: 'Start a project you\'ve been excited about', completed: false, points: 30 },
              { title: 'Mentor or help someone else', completed: false, points: 35 },
              { title: 'Create something meaningful', completed: false, points: 40 }
            ],
            color: 'bg-purple-50',
            borderColor: 'border-purple-200',
            icon: Calendar
          }
        ]
      };
      
      return taskCategories[currentMood] || taskCategories[3];
    };

    // Get current task categories - removed useMemo to fix fluctuation
    const taskCategories = getMoodBasedTaskCategories();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const completeTask = async (categoryIndex, taskIndex) => {
      const taskId = `${categoryIndex}-${taskIndex}`;
      if (completedTasks.includes(taskId)) return;

      const task = taskCategories[categoryIndex]?.tasks[taskIndex];
      if (!task) return;

      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));
      localStorage.setItem('completedTasksDate', getTodayDateString());

      // 1. Update points/streak in backend
      try {
        const res = await authAPI.updateActivity(task.points);
        setUser(prev => ({
          ...prev,
          points: res.points,
          streak: res.streak,
          level: res.level
        }));
      } catch (err) {
        console.error('Failed to update activity:', err);
      }

      // 2. Sync completed tasks to backend
      try {
        await authAPI.updateCompletedTasks(newCompletedTasks);
      } catch (err) {
        console.error('Failed to update completed tasks:', err);
      }

      // Show success notification
      setNotificationMessage(`+${task.points} points! Great job!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      // Show a brief success message
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.classList.add('bg-green-50', 'border-green-200');
        setTimeout(() => {
          taskElement.classList.remove('bg-green-50', 'border-green-200');
        }, 1000);
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Success Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} />
              <span>{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl animate-scaleIn">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl animate-pulse">{moodInfo?.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold">Mood-Based Tasks</h2>
              <p className="text-purple-100">Personalized tasks for your {moodInfo?.label.toLowerCase()} mood</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="text-purple-200" size={16} />
              <span>{taskCategories.reduce((total, cat) => total + cat.tasks.length, 0)} tasks available</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-purple-200" size={16} />
              <span>{completedTasks.length} completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-purple-200" size={16} />
              <span>{user.points || 0} total points</span>
            </div>
          </div>
        </div>

        {/* Task Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {taskCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className={`${category.color} p-6 rounded-xl border ${category.borderColor} animate-slideIn transition-all duration-300 hover:shadow-md hover:scale-105`} style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white rounded-lg transition-all duration-300 hover:scale-110">
                  <category.icon size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {category.tasks.map((task, taskIndex) => {
                  const taskId = `${categoryIndex}-${taskIndex}`;
                  const isCompleted = completedTasks.includes(taskId);
                  
                  return (
                    <div 
                      key={taskIndex} 
                      id={`task-${taskId}`}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => completeTask(categoryIndex, taskIndex)}
                          disabled={isCompleted}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white scale-110' 
                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:scale-105 active:scale-95 bg-white'
                          }`}
                          title={isCompleted ? 'Task completed!' : 'Click to complete task'}
                        >
                          {isCompleted && <CheckCircle size={16} />}
                          {!isCompleted && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                        </button>
                        <span className={`text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isCompleted 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        +{task.points}pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-purple-600">{completedTasks.length}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-green-600">
                {taskCategories.reduce((total, cat) => total + cat.tasks.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedTasks.length / (taskCategories.reduce((total, cat) => total + cat.tasks.length, 0) || 1)) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Leaderboard = () => {
    const getRankIcon = (rank) => {
      if (rank === 1) return <Crown className="text-yellow-500" size={20} />;
      if (rank === 2) return <Award className="text-gray-400" size={20} />;
      if (rank === 3) return <Trophy className="text-orange-500" size={20} />;
      return <span className="text-gray-500 font-bold">{rank}</span>;
    };

    const getRankColor = (rank) => {
      if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      return 'bg-white';
    };

    const currentUserRank = leaderboard.findIndex(entry => entry.id === user.id) + 1;

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-xl animate-scaleIn">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl animate-pulse">🏆</div>
            <div>
              <h2 className="text-2xl font-bold">Community Leaderboard</h2>
              <p className="text-yellow-100">See how you rank among other MindMate users</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="text-yellow-200" size={16} />
              <span>{leaderboard.length} active users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-200" size={16} />
              <span>Your rank: #{currentUserRank > 0 ? currentUserRank : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-yellow-200" size={16} />
              <span>{user.points || 0} points</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {leaderboardLoading && (
          <div className="bg-white p-8 rounded-xl shadow-sm border animate-pulse">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading leaderboard...</span>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        {!leaderboardLoading && (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`${getRankColor(entry.rank)} p-4 rounded-xl shadow-sm border transition-all duration-300 transform hover:scale-105 hover:shadow-md animate-slideIn ${
                  entry.id === user.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{entry.name}</h3>
                        {entry.id === user.id && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full animate-pulse">You</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Star size={14} />
                          <span>{entry.points} points</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp size={14} />
                          <span>Level {entry.level}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Trophy size={14} />
                          <span>{entry.streak} day streak</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-700">#{entry.rank}</div>
                    <div className="text-xs text-gray-500">
                      Joined {new Date(entry.joined).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Your Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2 text-blue-500" size={20} />
            Your Stats Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-blue-600">#{currentUserRank > 0 ? currentUserRank : 'N/A'}</div>
              <div className="text-sm text-gray-600">Current Rank</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-green-600">{user.points || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-purple-600">{user.level || 0}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
              <div className="text-2xl font-bold text-orange-600">{user.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const About = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl animate-scaleIn">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl animate-pulse">👨‍💻</div>
            <div>
              <h2 className="text-2xl font-bold">About MindMate</h2>
              <p className="text-purple-100">Meet the developer behind your mental wellness companion</p>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold animate-pulse">
              AS
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Arpit Sehal</h3>
              <p className="text-gray-600 mb-3">Full Stack Developer </p>
              <p className="text-sm text-gray-500 max-w-md">
                Passionate about creating technology that makes a positive impact on people's lives. 
                MindMate was born from the belief that mental wellness should be accessible, engaging, and personalized.
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Technologies */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Code className="mr-2 text-blue-500" size={20} />
              Technologies Used
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg transition-all duration-300 hover:bg-blue-100">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <span className="font-medium">React.js</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <span className="font-medium">Node.js</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg transition-all duration-300 hover:bg-purple-100">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="font-medium">SQLite</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg transition-all duration-300 hover:bg-yellow-100">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="font-medium">Tailwind CSS</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PaletteIcon className="mr-2 text-purple-500" size={20} />
              Features Built
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg transition-all duration-300 hover:bg-purple-100">
                <Brain className="text-purple-600" size={16} />
                <span className="font-medium">Mood Tracking & Analytics</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                <Target className="text-green-600" size={16} />
                <span className="font-medium">Personalized Tasks</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg transition-all duration-300 hover:bg-blue-100">
                <Activity className="text-blue-600" size={16} />
                <span className="font-medium">Self-Care Activities</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg transition-all duration-300 hover:bg-orange-100">
                <Trophy className="text-orange-600" size={16} />
                <span className="font-medium">Gamification System</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg transition-all duration-300 hover:bg-pink-100">
                <Users className="text-pink-600" size={16} />
                <span className="font-medium">Community Features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="mr-2 text-green-500" size={20} />
            Connect With Me
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="https://github.com/arpitsehal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 transform"
            >
              <Github className="text-gray-800" size={20} />
              <span className="font-medium">GitHub</span>
            </a>
            <a 
              href="https://x.com/_axpiit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:scale-105 transform"
            >
              <Twitter className="text-blue-600" size={20} />
              <span className="font-medium">Twitter</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/arpitsehal/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-blue-100 rounded-lg transition-all duration-300 hover:bg-blue-200 hover:scale-105 transform"
            >
              <Linkedin className="text-blue-700" size={20} />
              <span className="font-medium">LinkedIn</span>
            </a>
            <a 
              href="mailto:2005sehalarpit@gmail.com" 
              className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg transition-all duration-300 hover:bg-red-100 hover:scale-105 transform"
            >
              <Mail className="text-red-600" size={20} />
              <span className="font-medium">Email</span>
            </a>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border animate-slideIn transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="mr-2 text-blue-500" size={20} />
            About MindMate
          </h3>
          <div className="space-y-4 text-gray-700">
            <p>
              MindMate is a comprehensive mental wellness platform designed to support your journey toward better mental health. 
              Built with modern web technologies and a focus on user experience, it combines evidence-based practices with 
              engaging gamification elements.
            </p>
            <p>
              The platform features mood tracking, personalized self-care activities, community support, and a unique 
              task system that adapts to your emotional state. Every feature is designed with privacy and user well-being in mind.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Privacy Focused</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Always Available</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Free</div>
                <div className="text-sm text-gray-600">Forever</div>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Profile Link */}
        <a 
          href="https://www.linkedin.com/in/arpitsehal/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mt-2 text-blue-700 underline text-sm hover:text-blue-900"
        >
      
        </a>
      </div>
    );
  };

  const renderCurrentView = () => {
    const views = {
      activities: <Activities />,
      tasks: <Tasks />,
      community: <Community />,
      profile: <Profile />,
      dashboard: <Dashboard />,
      leaderboard: <Leaderboard />,
      about: <About />
    };
    
    return (
      <div className="animate-fadeIn">
        {views[currentView]}
      </div>
    );
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    // Clear completedToday and its date on logout
    localStorage.removeItem('completedToday');
    localStorage.removeItem('completedTodayDate');
    // Clear completedTasks and its date on logout
    localStorage.removeItem('completedTasks');
    localStorage.removeItem('completedTasksDate');
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-bg-gradient min-h-screen relative pb-4">
      {/* Animated Blobs */}
      <div className="animated-blob" style={{top: '-120px', left: '-80px', width: '320px', height: '320px', background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)'}}></div>
      <div className="animated-blob delay-1" style={{bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'}}></div>
      <div className="animated-blob delay-2" style={{top: '60%', left: '-120px', width: '220px', height: '220px', background: 'linear-gradient(135deg, #fcd34d 0%, #f87171 100%)'}}></div>

      <header className="glassy-header sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold gradient-title">MindMate</h1>
            </div>
            <nav className="flex space-x-2 items-center">
              <NavButton view="dashboard" icon={Calendar} label="Dashboard" active={currentView === 'dashboard'} />
              <NavButton view="tasks" icon={Target} label="Tasks" active={currentView === 'tasks'} />
              <NavButton view="activities" icon={Activity} label="Activities" active={currentView === 'activities'} />
              <NavButton view="leaderboard" icon={Trophy} label="Leaderboard" active={currentView === 'leaderboard'} />
              <NavButton view="community" icon={Users} label="Community" active={currentView === 'community'} />
              <NavButton view="profile" icon={Settings} label="Profile" active={currentView === 'profile'} />
              <NavButton view="about" icon={Info} label="About" active={currentView === 'about'} />
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 logout-btn hover:shadow-lg transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Wrap all main cards in glass-card */}
        <div className="space-y-8">
          {renderCurrentView()}
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-12 glass-card max-w-6xl mx-auto rounded-2xl shadow-xl">
        <div className="px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand & Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold gradient-title">MindMate</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your personal mental health companion—take care of your mind, one day at a time. 
                We're here to support your wellness journey with science-backed tools and compassionate care. 💙
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Always here for you, 24/7</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Quick Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setCurrentView('dashboard')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('tasks')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Tasks
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('activities')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Activities
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('leaderboard')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('community')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Community
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('profile')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentView('about')} 
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources & Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Resources & Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/mental-health-tips" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mental Health Tips
                  </a>
                </li>
                <li>
                  <a href="/crisis-support" className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 hover:translate-x-1 transform">
                    <Phone className="w-4 h-4 mr-2" />
                    Crisis Support
                  </a>
                </li>
                <li>
                  <a href="/meditation-guides" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform">
                    <Zap className="w-4 h-4 mr-2" />
                    Meditation Guides
                  </a>
                </li>
                <li>
                  <a href="/faq" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/contact" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                Stay Connected
              </h3>
              <p className="text-gray-600 text-sm">
                Get weekly wellness tips, mindfulness exercises, and mental health insights delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Subscribe to newsletter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Subscribe
                </button>
              </form>
              
              {/* Social Media */}
              <div className="pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  <a 
                    href="https://x.com/_axpiit" 
                    aria-label="Twitter" 
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 521.949 521.949">
                      <path d="M459.4 151.7c.3 4.5.3 9.1.3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2 -98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7 -84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8 -46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6 -7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.instagram.com/sehal_arpit?igsh=NGthcG9jeGEyczVt" 
                    aria-label="Instagram" 
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08 c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363 .416-2.427.465-1.067.048-1.407.06 -4.123.06h-.08c-2.643 0-2.987 -.012-4.043-.06-1.064-.049-1.791 -.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416 -1.363-.465-2.427-.048-1.055 -.06-1.37-.06-4.041v-.08c0 -2.597.01-2.917.058-3.96a4.902 4.902 0 01.465-2.427 4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363 -.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000 -12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406 -11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://github.com/arpitsehal" 
                    aria-label="GitHub" 
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M12 .297a12 12 0 00-3.79 23.4c.6.112.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.61-4.042-1.61 -.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.084-.729.084-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492 .998 .108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.301 1.23a11.49 11.49 0 013.005-.404 c1.02.005 2.045.138 3.005.404 2.29-1.553 3.297-1.23 3.297-1.23 .653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.92.43.37.815 1.096.815 2.21 0 1.595-.015 2.88-.015 3.27 0 .32.217.694.825.576A12.005 12.005 0 0012 .297" clipRule="evenodd"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>© {new Date().getFullYear()} MindMate. All rights reserved.</span>
                <span>•</span>
                <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Made with care for mental wellness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MindMate;