import React from 'react';
import Link from 'next/link';
import { Vote, UserPlus, Lock } from 'lucide-react';

const HeroSection = () => {
  return (
<section className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-48 px-6 text-center relative overflow-hidden">
<div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Your Vote, Your Voice: Secure and Transparent Voting
        </h1>
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-gray-100">
          Empowering democratic participation through cutting-edge technology and uncompromising security.
        </p>

        <div className="flex flex-col sm:flex-row sm:space-x-6 gap-6 sm:gap-0 justify-center">
          <Link href="/register">
            <button
              className="group flex items-center gap-3 bg-white text-indigo-700 px-8 py-6 rounded-lg font-bold 
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-100
              focus:outline-none focus:ring-4 focus:ring-indigo-300 w-full sm:w-auto"
            >
              <Vote className="group-hover:rotate-12 transition-transform" />
              Register to Vote
            </button>
          </Link>

          <Link href="/nominate">
            <button
              className="group flex items-center gap-3 bg-emerald-500 text-white px-8 py-6 rounded-lg font-bold 
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-emerald-600
              focus:outline-none focus:ring-4 focus:ring-emerald-300 w-full sm:w-auto"
            >
              <UserPlus className="group-hover:rotate-6 transition-transform" />
              Nominate Yourself
            </button>
          </Link>

          <Link href="/admin">
            <button
              className="group flex items-center gap-3 bg-amber-500 text-white px-8 py-6 rounded-lg font-bold 
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-amber-600
              focus:outline-none focus:ring-4 focus:ring-amber-300 w-full sm:w-auto"
            >
              <Lock className="group-hover:-rotate-6 transition-transform" />
              Admin Login
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
