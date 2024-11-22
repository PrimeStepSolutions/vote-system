import React from 'react';
import { Users, ShieldCheck, Globe } from 'lucide-react';

const VotingSupport = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600 opacity-5 transform rotate-[-6deg] scale-150"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-12 space-y-8">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-indigo-900 mb-6 tracking-tight">
              Your Voting Resource Center
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering voters with comprehensive information, secure guidance, and community support to ensure a confident and informed voting experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <Users 
                className="mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" 
                size={56} 
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">
                Community Resources
              </h3>
              <p className="text-gray-600">
                Connect with local voter assistance groups, find polling locations, and access community support networks.
              </p>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <ShieldCheck 
                className="mx-auto mb-4 text-emerald-600 group-hover:scale-110 transition-transform" 
                size={56} 
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">
                Voter Protection
              </h3>
              <p className="text-gray-600">
                Learn about your voting rights, get legal guidance, and understand protections against voter suppression.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl text-center hover:shadow-xl transition-all group">
              <Globe 
                className="mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform" 
                size={56} 
                strokeWidth={1.5}
              />
              <h3 className="text-2xl font-bold text-indigo-900 mb-3">
                Informational Hub
              </h3>
              <p className="text-gray-600">
                Access comprehensive voter guides, election timelines, candidate information, and voting procedure details.
              </p>
            </div>
          </div>
          
          {/* <div className="flex justify-center space-x-6 mt-8">
            <button 
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold 
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-700
              focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Get Started
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default VotingSupport;