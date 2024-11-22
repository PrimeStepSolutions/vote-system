import React from 'react';
import { ShieldCheck, Lock, Fingerprint } from 'lucide-react';

const SecurityBadge = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-12 tracking-tight">
          Your Security, Our Priority
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* SSL Secured */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="text-blue-600 w-16 h-16" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">SSL Secured</h3>
            <p className="text-gray-600">
              Advanced encryption protects your data transmission and voting integrity.
            </p>
          </div>

          {/* Confidential Voting */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="mb-4 flex justify-center">
              <Lock className="text-green-600 w-16 h-16" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">100% Confidential</h3>
            <p className="text-gray-600">
              Complete privacy guaranteed with zero-knowledge voting protocols.
            </p>
          </div>

          {/* Biometric Security */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="mb-4 flex justify-center">
              <Fingerprint className="text-purple-600 w-16 h-16" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">Multi-Factor Auth</h3>
            <p className="text-gray-600">
              Biometric and OTP verification ensures maximum account security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityBadge;