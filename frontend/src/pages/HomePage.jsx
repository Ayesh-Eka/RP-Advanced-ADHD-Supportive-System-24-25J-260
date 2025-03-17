
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const HomePage = () => {
  const features = [
    {
      title: 'ADHD Identification',
      description:
        'Discover tools to help identify and manage ADHD symptoms in a fun and engaging way!',
      icon: '🧠',
      path: '#', 
    },
    {
      title: 'Cognitive Enhancement',
      description:
        'Boost your brainpower with games and activities designed to improve focus and memory!',
      icon: '🚀',
      path: '#',
    },
    {
      title: 'Organize Daily Tasks',
      description:
        'Hello! You can organize your daily tasks and create an Eisenhower matrix without any guidance.',
      icon: '📅',
      path: '/EducationalActivity',
    },
    {
      title: 'Improve Social Skills',
      description:
        'Learn how to make friends, communicate better, and build confidence through interactive lessons!',
      icon: '🤝',
      path: '#',
    },
  ];

  const quickLinks = [
    'ADHD Analyzer',
    'Cognitive Enhancement',
    'Manage Daily Tasks',
    'Develop Social Skills',
    'Prioritization',
    'Check Progress',
    'Social Skills Chat',
    'ChatBuddy',
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6 animate-bounce">
            Welcome to NeuroAssist! 🌟
          </h1>
          <p className="text-xl text-white mb-8">
            Empowering young minds with advanced ADHD support tools. Let’s create a better journey together!
          </p>
          <p className="text-gray-200">
            Fun, interactive, and designed just for you! Explore tools to help you focus, learn, and grow.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-700">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path} // Link to the specified path
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center block"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Quick Links
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href="/text-chatbot"
                className="bg-white text-purple-700 px-6 py-3 rounded-full hover:bg-purple-100 hover:text-purple-900 transition-all duration-300 shadow-md"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Fun Footer */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto text-center">
          <p className="text-white">
            Made with ❤️ for kids aged 6-12 | © 2023 NeuroAssist
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;