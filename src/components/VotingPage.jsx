import React, { useState } from 'react';
import { Vote } from 'lucide-react';

const VotingPage = ({ nominations }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voted, setVoted] = useState(false); // Track if the user has voted

  const handleVote = () => {
    if (selectedCandidate) {
      alert(`You voted for ${selectedCandidate.name}`);
      setVoted(true);  // Set the voted state to true
    } else {
      alert('Please select a candidate to vote');
    }
  };

  const resetVote = () => {
    setVoted(false); // Reset the voting state to allow for a new selection
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Vote for Your Candidate</h2>
        
        {/* If voted, show Thank You message */}
        {voted ? (
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-green-600 mb-4">Thank You for Voting!</h3>
            <p className="text-lg text-gray-700 mb-4">Your vote has been successfully recorded.</p>
            <button 
              onClick={resetVote} 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Cast Another Vote
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nominations.map((nomination, index) => {
              const PartyIcon = nomination.PartyIcon || 'Flag'; // Default icon
              return (
                <div 
                  key={index}
                  onClick={() => setSelectedCandidate(nomination)}
                  className={`
                    cursor-pointer border-2 p-6 rounded-lg transition-all
                    ${selectedCandidate === nomination 
                      ? 'border-green-500 bg-green-50 ring-4 ring-green-200' 
                      : 'border-gray-200 hover:border-blue-300'}
                  `}
                >
                  <div className="flex justify-between items-center mb-4">
                    <PartyIcon size={36} className="text-blue-600" />
                    <input 
                      type="radio" 
                      checked={selectedCandidate === nomination}
                      onChange={() => setSelectedCandidate(nomination)}
                      className="form-radio"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">{nomination.name}</h3>
                  <p className="text-gray-600 mb-4">{nomination.email}</p>
                  <p className="text-gray-700 italic">{nomination.reason}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Voting Button */}
        {!voted && (
          <button
            onClick={handleVote}
            disabled={!selectedCandidate}
            className={`
              mt-8 w-full py-3 rounded-lg transition flex items-center justify-center
              ${selectedCandidate 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            <Vote className="mr-2" />
            {selectedCandidate ? `Vote for ${selectedCandidate.name}` : 'Select a Candidate'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
