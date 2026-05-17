import React from 'react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Medical Disclaimer</h1>
        <p className="text-gray-500 text-sm mb-8">Version: 2026.1</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Not Medical Advice</h2>
          <p className="text-gray-600 leading-relaxed font-medium">
            The content on Svasthya Connect, including AI-powered report analysis and health recommendations, is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Consult a Professional</h2>
          <p className="text-gray-600 leading-relaxed">
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. AI Recommendations</h2>
          <p className="text-gray-600 leading-relaxed italic">
            AI recommendations are based on patterns in data and should only be used as a starting point. They are not a replacement for a clinical examination by a registered medical practitioner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Accuracy of Information</h2>
          <p className="text-gray-600 leading-relaxed">
            While we strive for accuracy, medical information is constantly evolving. Svasthya Connect makes no guarantees regarding the completeness or accuracy of the information provided on the platform.
          </p>
        </section>

        <div className="mt-10 p-4 bg-red-50 border-l-4 border-red-600 rounded">
          <p className="text-red-700 text-sm">
            <strong>Emergency:</strong> If you are experiencing a medical emergency, call 108 or visit the nearest hospital immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
