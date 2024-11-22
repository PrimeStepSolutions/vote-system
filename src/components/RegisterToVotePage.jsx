import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  User, Mail, MapPin, Calendar, Phone, FileText, 
  Flag, Landmark, CloudLightning, Vote, ThumbsUp
} from 'lucide-react';
import { useRouter } from 'next/router';

const ThankYouModal = ({ candidate, onClose }) => {
  const router = useRouter();

  const handleClose = () => {
    onClose(); // Close the modal
    router.push('/'); // Redirect to the main page (or any other page you want)
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <ThumbsUp className="mx-auto text-green-600 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">Thank You for Voting!</h2>
        <p className="text-gray-700 mb-6">
          You&apos;ve successfully cast your vote for {candidate.name}. 
          Your participation is crucial to our democratic process.
        </p>
        <button 
          onClick={handleClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// VotingPage Component (for voting process)
const VotingPage = ({ nominations }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState([]);

  useEffect(() => {
    // Fetch initial voting data from the server
    const fetchVotingData = async () => {
      try {
        const response = await axios.get('/api/vote'); // Fetch current vote data
        setVoteCount(response.data); // Set initial vote counts
      } catch (error) {
        console.error('Error fetching voting data:', error);
      }
    };

    fetchVotingData();
  }, []);

  const handleVote = async () => {
    if (selectedCandidate) {
      try {
        // Send the vote to the server
        const response = await axios.post('/api/vote', {
          candidateId: selectedCandidate.id,
        });

        if (response.data.success) {
          // After voting, refetch the updated voting data from the server
          const updatedVotingData = await axios.get('/api/vote');
          setVoteCount(updatedVotingData.data);
          setHasVoted(true); // Show the 'Thank You' message
        }
      } catch (error) {
        console.error('Voting failed:', error);
        alert('An error occurred while voting. Please try again.');
      }
    } else {
      alert('Please select a candidate to vote');
    }
  };
  

  const closeThankYouModal = () => {
    setHasVoted(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {hasVoted && (
        <ThankYouModal 
          candidate={selectedCandidate} 
          onClose={closeThankYouModal} 
        />
      )}
      
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center flex items-center justify-center">
          <Vote className="mr-3 text-blue-600" />
          Vote for Your Candidate
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nominations.map((nomination) => {
            return (
              <div 
                key={nomination.id}
                onClick={() => setSelectedCandidate(nomination)}
                className={`
                  cursor-pointer border-2 p-6 rounded-lg transition-all group
                  ${selectedCandidate === nomination 
                    ? 'border-green-500 bg-green-50 ring-4 ring-green-200' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <input 
                    type="radio" 
                    checked={selectedCandidate === nomination}
                    onChange={() => setSelectedCandidate(nomination)}
                    className="form-radio"
                  />
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2 group-hover:text-blue-800 transition">
                  {nomination.name}
                </h3>
                {/* <h3>{nomination.name}</h3> */}
            <p>{nomination.partyName}</p>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={handleVote}
          disabled={!selectedCandidate}
          className={`
            mt-8 w-full py-3 rounded-lg transition flex items-center justify-center
            ${selectedCandidate 
              ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <Vote className="mr-2" />
          {selectedCandidate ? `Vote for ${selectedCandidate.name}` : 'Select a Candidate'}
        </button>
      </div>
    </div>
  );
};

// RegisterToVotePage Component (for registration process)
const RegisterToVotePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [nominations, setNominations] = useState([]);

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const response = await axios.get('/api/nominate'); // Fetch nominations from API
        setNominations(response.data);
      } catch (error) {
        console.error('Error fetching nominations:', error);
        alert('Failed to fetch nominations.');
      }
    };

    fetchNominations();
  }, []); // This will run once when the component mounts

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/register', data);
      setEmail(data.email);
      setOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/api/verify-otp', { email, otp });
      setIsVerified(true);
      alert(response.data.message);
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'OTP verification failed.');
    }
  };

  if (isVerified) {
    return <VotingPage nominations={nominations} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8">
        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">Register to Vote</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" />
                  <input
                    {...register('fullName', { required: 'Full Name is required' })}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phoneNumber', { required: 'Phone Number is required' })}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    {...register('address', { required: 'Address is required' })}
                    placeholder="Address"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" />
                  <input
                    {...register('idNumber', { required: 'ID Number is required' })}
                    placeholder="ID Number"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.idNumber && <p className="text-red-500">{errors.idNumber.message}</p>}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        )}
        {otpSent && (
          <div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={verifyOtp}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterToVotePage;