import React from 'react';
import Link from 'next/link';
import { UserPlus, Target, Vote, Trophy } from 'lucide-react';

const VotingPhasesTimeline = () => {
  const phases = [
    { 
      title: "Registration", 
      description: "Sign up and verify your participation.", 
      color: "from-green-400 to-green-600",
      icon: UserPlus,
      details: "Complete your profile and verify your eligibility.",
      route: "/register"
    },
    { 
      title: "Nomination", 
      description: "Nominate candidates or yourself.", 
      color: "from-amber-400 to-amber-600",
      icon: Target,
      details: "Submit and review potential candidates.",
      route: "/nominate"
    },
    { 
      title: "Voting", 
      description: "Cast your secure digital vote.", 
      color: "from-blue-500 to-blue-700",
      icon: Vote,
      details: "Make an informed choice using our secure platform.",
      route: "/vote"
    },
    { 
      title: "Results", 
      description: "Transparent outcome announcement.", 
      color: "from-purple-500 to-purple-700",
      icon: Trophy,
      details: "Immediate and verifiable election results.",
      route: "/admin"
    }
  ];

  return (
    <section className="py-12 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-extrabold text-center text-indigo-900 mb-16 tracking-tight">
          Voting Phases Timeline
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase, idx) => {
            const PhaseIcon = phase.icon;
            return (
              <Link 
                key={idx} 
                href={phase.route}
                className={`
                  bg-gradient-to-br ${phase.color} 
                  text-white p-8 rounded-3xl shadow-xl 
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl 
                  group cursor-pointer
                `}
              >
                <div className="flex flex-col items-center">
                  <PhaseIcon 
                    className="mb-6 text-white group-hover:rotate-12 transition-transform" 
                    size={60} // Increase the icon size
                    strokeWidth={2} // Slightly thicker strokes
                  />
                  <h3 className="text-2xl font-bold mb-2 text-center">{phase.title}</h3>
                  <p className="text-sm text-center mb-4 opacity-90">{phase.description}</p>
                  <p className="text-xs text-center opacity-70 group-hover:opacity-100 transition-opacity">
                    {phase.details}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VotingPhasesTimeline;
