import React, { useState, useEffect } from 'react';
import { Brain, Heart, Target, Users, Star, ChevronDown, Menu, X, Mail, Phone } from 'lucide-react';
import './MindMateLanding.css';

const MindMateLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your mood patterns and mental health goals."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Mood Tracking",
      description: "Monitor your emotional journey with intuitive tools and visualize your progress over time."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Setting",
      description: "Set meaningful mental wellness goals and receive AI-guided support to achieve them."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Connect with others on similar journeys in a safe, supportive environment."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "MindMate has transformed how I approach my mental health. The AI insights are incredibly helpful!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      content: "The mood tracking feature helped me identify patterns I never noticed. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content: "The community aspect makes me feel less alone in my journey. Amazing platform!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How does MindMate's AI work?",
      answer: "Our AI analyzes your mood patterns, habits, and goals to provide personalized insights and recommendations tailored to your unique mental wellness journey."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. We use end-to-end encryption and follow strict privacy protocols. Your data is never shared without your explicit consent."
    },
    {
      question: "Can I use MindMate alongside therapy?",
      answer: "Yes! MindMate is designed to complement professional therapy and counseling, not replace it. Many users find it enhances their therapeutic journey."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 7-day free trial with full access to all features. No credit card required to start."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindMate
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Reviews</a>
              <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-colors">FAQ</a>
              <a href="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 animate-pulse">
                Get Started
              </a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700">Features</a>
              <a href="#testimonials" className="block text-gray-700">Reviews</a>
              <a href="#faq" className="block text-gray-700">FAQ</a>
              <a href="/login" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-full hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 animate-pulse block text-center">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-8 animate-pulse">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Mental Wellness</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personal
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Wellness Companion
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track your mood, set meaningful goals, and build healthy habits with AI-powered insights. 
              Join our supportive community and take control of your mental health journey.
            </p>
            
            <div className="flex justify-center">
              <a href="/login" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 group animate-pulse">
                Start Your Journey
                <Heart className="inline-block w-6 h-6 ml-3 group-hover:animate-bounce" />
              </a>
            </div>
          </div>
          
          <div className={`mt-16 transform transition-all duration-1000 delay-500 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">4.9★</div>
                  <div className="text-gray-600">App Rating</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-purple-600">Better Mental Health</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover tools designed to support your mental wellness journey with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:bg-white/90 transform hover:-translate-y-3 hover:scale-105 transition-all duration-500 group animate-bounce ${
                  isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 200}ms` }}
              >
                <div className="text-purple-600 mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 animate-fadeInUp ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 hover:text-purple-600 transition-colors duration-500">
              What Our 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient hover:scale-105 transition-transform duration-300 inline-block">
                Users Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 hover:text-gray-800 transition-colors duration-300">
              Real stories from real people who transformed their mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:bg-white/95 transform hover:-translate-y-2 hover:scale-105 hover:rotate-1 transition-all duration-500 animate-fadeInUp ${
                  isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms`, animationDelay: `${index * 300}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current hover:scale-125 hover:rotate-12 transition-transform duration-200" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about MindMate
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:bg-white/95 transform hover:-translate-y-1 hover:scale-102 transition-all duration-500 animate-slideInLeft ${
                  isVisible.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms`, animationDelay: `${index * 200}ms` }}
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-purple-50/50 hover:scale-102 transition-all duration-300 group"
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors duration-300">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-purple-600 transform transition-transform duration-300 group-hover:scale-125 ${
                    activeQuestion === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeQuestion === index && (
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MindMate</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your personal companion for mental wellness, powered by AI and supported by community.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="/login" className="block text-gray-300 hover:text-white transition-colors">Get Started</a>
                <a href="/login" className="block text-gray-300 hover:text-white transition-colors">Login</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#faq" className="block text-gray-300 hover:text-white transition-colors">Help Center</a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Community</a>
                <a href="mailto:hello@mindmate.com" className="block text-gray-300 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-gray-300">hello@mindmate.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 MindMate. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MindMateLanding; 