import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Search, Download, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Share Materials",
      desc: "Upload your notes, PDFs, and study materials to help fellow students"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Discover Resources",
      desc: "Find study materials by branch, semester, or subject with ease"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Download & Save",
      desc: "Access study materials anytime, anywhere. Download for offline use"
    }
  ];

  const stats = [
    { number: "1000+", label: "Study Materials" },
    { number: "500+", label: "Active Students" },
    { number: "8+", label: "Branches" },
    { number: "100+", label: "Subjects" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-7 w-7 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">Syllabox</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </Link>
            <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
              🎓 For College Students
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-3">
              Share & Discover
              <span className="text-indigo-600"> Study Materials</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join Syllabox to share and access study materials with your peers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="bg-indigo-600 text-white px-7 py-3 rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors flex items-center">
                Start Sharing <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
              <Link to="/login" className="border-2 border-gray-300 text-gray-700 px-7 py-3 rounded-lg text-base font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 text-yellow-500 mr-1.5" />
                Free forever
              </span>
            </div>
          </div>

          {/* Right Preview */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">📚 Latest Materials</h4>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Today</span>
                </div>
                {[
                  { title: "DSA Complete Notes", info: "CSE • Semester 3" },
                  { title: "Calculus Formula Sheet", info: "CSE-AI • Semester 1" },
                  { title: "Physics Lab Manual", info: "ECE • Semester 2" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-2.5 mb-2 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs opacity-80">{item.info}</p>
                      </div>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">PDF</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center text-xs text-gray-400">
                🔥 12 new materials uploaded today
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/60 rounded-xl py-3 shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Everything you need to <span className="text-indigo-600">succeed</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Syllabox provides all the tools you need to share and discover study materials
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl py-10 px-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start sharing?</h2>
          <p className="text-base opacity-90 mt-2">Join hundreds of students already using Syllabox</p>
          <Link to="/register" className="inline-block mt-5 bg-white text-indigo-600 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-5 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-gray-800">Syllabox</span>
            <span className="text-xs text-gray-400">© 2026</span>
          </div>
          <div className="flex space-x-5 text-xs text-gray-400 mt-3 md:mt-0">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy</span>
            <span className="hover:text-indigo-600 cursor-pointer">Terms</span>
            <span className="hover:text-indigo-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;