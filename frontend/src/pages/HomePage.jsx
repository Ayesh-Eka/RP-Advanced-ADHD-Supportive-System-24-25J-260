import React from 'react';

const HomePage = () => {
  const features = [
    {
      title: 'ADHD Identification',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi ac aliquet sodales, sapien orci aliquam libero.',
    },
    {
      title: 'Cognitive Enhancement',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi ac aliquet sodales, sapien orci aliquam libero.',
    },
    {
      title: 'Prioritize Daily Tasks',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi ac aliquet sodales, sapien orci aliquam libero.',
    },
    {
      title: 'Improve Social Skills',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi ac aliquet sodales, sapien orci aliquam libero.',
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
      <div className="bg-blue-50 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to NeuroAssist!</h1>
          <p className="text-lg mb-8">
            Empowering young minds with advanced ADHD support tools. Let’s create a better journey together!
          </p>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi ac aliquet sodales, sapien orci
            aliquam libero, et egestas odio metus non lacus.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href="/text-chatbot"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;