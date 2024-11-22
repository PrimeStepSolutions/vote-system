import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, FileText, PlusCircle, Trash2, Flag, Landmark, CloudLightning, Hexagon, Star, Target } from 'lucide-react';

const NominateCandidatesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    partyName: '', // New field for Party Name
  });
  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [nominations, setNominations] = useState([]);
  const [isSelfNomination, setIsSelfNomination] = useState(false);

  // Party symbol icons
  const partySymbols = [Flag, Landmark, CloudLightning, Hexagon, Star, Target];

  const getRandomPartySymbol = () => {
    const randomIndex = Math.floor(Math.random() * partySymbols.length);
    return partySymbols[randomIndex];
  };

  useEffect(() => {
    // Fetch nominations from the API on component mount
    const fetchNominations = async () => {
      try {
        const response = await axios.get('/api/nominate');
        setNominations(response.data); // Set nominations from API
      } catch (error) {
        console.error('Error fetching nominations:', error);
        alert('Failed to load nominations.');
      }
    };

    fetchNominations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNominationToggle = () => {
    setIsSelfNomination((prev) => !prev);
    setFormData((prevState) => ({
      ...prevState,
      name: isSelfNomination ? '' : 'Myself',
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.reason || !formData.partyName) {
      alert('Please fill out all fields!');
      return;
    }

    try {
      const response = await axios.post('/api/nominate', formData);
      setEmailForOtp(formData.email); // Store the email for OTP verification
      alert(response.data.message);
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      alert('Nomination submission failed.');
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || !emailForOtp) {
      alert('Please enter the OTP!');
      return;
    }

    try {
      const response = await axios.post('/api/nominate', { otp, email: emailForOtp });
      alert(response.data.message);

      // If OTP verification succeeds, update nominations list with a random party symbol
      setNominations((prev) => [
        ...prev,
        {
          ...formData,
          isVerified: true,
          partySymbol: getRandomPartySymbol(),
        },
      ]);
      setFormData({ name: '', email: '', reason: '', partyName: '' }); // Reset the form
      setOtp(''); // Clear the OTP input
      setEmailForOtp('');
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message);
      alert('OTP verification failed.');
    }
  };

  const handleDelete = (index) => {
    setNominations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          Nominate Candidates
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Nominate yourself or others to make a difference! Submit and review potential candidates.
        </p>

        {/* Nomination Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nomination Form</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSelfNomination}
                placeholder="Candidate's Name"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Candidate's Email"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="relative col-span-2">
              <FileText className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Reason for Nomination"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300 h-32"
              />
            </div>
            <div className="relative col-span-2">
              <input
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handleInputChange}
                placeholder="Party Name"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={isSelfNomination}
                onChange={handleNominationToggle}
                className="mr-2"
              />
              Nominate Myself
            </label>
            <button
              onClick={handleSubmit}
              className="flex items-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircle className="mr-2" />
              Submit Nomination
            </button>
          </div>
        </div>

        {/* OTP Verification */}
        {emailForOtp && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verify OTP</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleOtpVerification}
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {/* Submitted Nominations */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submitted Nominations</h2>
          {nominations.length === 0 ? (
            <p className="text-gray-600">No nominations submitted yet. Be the first to nominate!</p>
          ) : (
            <div className="grid gap-6">
              {nominations.map((nomination, index) => {
                const PartyIcon = nomination.partySymbol || Flag; // Default to Flag if no icon
                return (
                  <div
                    key={index}
                    className={`bg-white border shadow-sm p-4 rounded-lg flex justify-between items-center ${
                      nomination.isVerified ? 'border-green-500' : 'border-red-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <PartyIcon
                        size={36}
                        className={`text-blue-600 ${nomination.isVerified ? 'opacity-100' : 'opacity-50'}`}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{nomination.name}</p>
                        <p className="text-sm text-gray-600">{nomination.reason}</p>
                        <p className="text-xs text-gray-500">{nomination.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NominateCandidatesPage;
