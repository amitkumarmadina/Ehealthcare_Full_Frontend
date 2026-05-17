import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Effective Date: May 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using Svasthya Connect, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Services Provided</h2>
          <p className="text-gray-600 leading-relaxed">
            Svasthya Connect provides a platform for booking medical appointments, video consultations, and AI-powered health report analysis. Our platform is a facilitator and not a medical provider.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibility</h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for providing accurate health information and maintaining the confidentiality of your account credentials. Misuse of the platform or providing false emergency information is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Emergency Services</h2>
          <p className="text-gray-600 leading-relaxed">
            While we provide ambulance and emergency contact information, Svasthya Connect is not responsible for the response time or service quality of third-party emergency providers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Svasthya Connect shall not be liable for any medical outcomes resulting from consultations or recommendations provided by doctors or AI tools on our platform.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
