import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Vote, CheckCircle, XCircle, BarChart2, PieChart as IconPieChart, Trophy } from 'lucide-react';

const AdminDashboard = () => {
  const [votingData, setVotingData] = useState({
    totalVoters: 0,
    totalNominations: 0,
    votingResults: [],
    registeredVoters: [],
    candidates: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteCount, setVoteCount] = useState([]);

  useEffect(() => {
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

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard data from API endpoints
      const dashboardResponse = await axios.get('/dashboard'); // Fetch updated dashboard data
      const nominationsResponse = await axios.get('/api/nominate');

      setVotingData({
        totalVoters: dashboardResponse.data.totalVoters,
        totalNominations: dashboardResponse.data.totalNominations,
        registeredVoters: dashboardResponse.data.registeredVoters,
        candidates: dashboardResponse.data.candidates,
        votingResults: nominationsResponse.data.map((item) => ({
          candidate: item.partyName,
          totalVotes: item.votes || 0,
        })),
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5000); // Refetch data every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/register'); // Fetch data from API
        setUsers(response.data); // Store the data in state
        setLoading(false); // Set loading state to false
      } catch (err) {
        setError('Failed to fetch registered users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 flex items-center">
            <Trophy className="mr-4 text-yellow-500" /> Admin Dashboard
          </h1>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6">
          <OverviewCard
            icon={<Users />}
            title="Total Voters"
            value={votingData.totalVoters}
            color="text-blue-600"
          />
          <OverviewCard
            icon={<Vote />}
            title="Nominations"
            value={votingData.totalNominations}
            color="text-green-600"
          />
          <OverviewCard
            icon={<CheckCircle />}
            title="Verified Voters"
            value={votingData.registeredVoters ? votingData.registeredVoters.length : 0}
            color="text-purple-600"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BarChart2 className="mr-2 text-indigo-600" /> Voting Results
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={votingData.votingResults}>
                <XAxis dataKey="candidate" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalVotes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <IconPieChart className="mr-2 text-green-600" /> Candidate Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={votingData.candidates}  // This is the updated candidates data with new vote counts
                  dataKey="votes"
                  nameKey="name"
                  fill="#10B981"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone Number</th>
                  <th className="p-3 text-left">Date of Birth</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phoneNumber}</td>
                    <td className="p-3">{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                    <td className="p-3">
                      {user.isVerified ? (
                        <span className="text-green-500">Verified</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

const OverviewCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
    <div className={`mr-4 ${color}`}>
      {React.cloneElement(icon, { size: 48 })}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center min-h-screen bg-red-50">
    <div className="text-center">
      <XCircle className="mx-auto text-red-500 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
      <p className="text-red-600">{message}</p>
    </div>
  </div>
);

export default AdminDashboard;
