import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://jayanththalla33:bljw5G3RzwKsWnkE@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); // Removed deprecated options

// This will hold the connection and prevent reconnecting on every request
let db;

async function connectToDb() {
  if (!db) {
    try {
      await client.connect();
      console.log("Connected to MongoDB Atlas");
      db = client.db('voter-registration'); // Initialize db connection
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ensure the DB connection is established before querying
      await connectToDb();

      const nominationsCollection = db.collection('nominations');

      // Fetch nominations for /api/nominate
      if (req.url === '/api/nominate') {
        const nominations = await nominationsCollection.find({}).toArray();
        return res.status(200).json(nominations);
      }

      // Fetch summary data for /dashboard
      if (req.url === '/api/dashboard') {
        const totalNominations = await nominationsCollection.countDocuments({});
        const totalVoters = await nominationsCollection.countDocuments({ isVerified: true });
        const registeredVoters = await nominationsCollection.find({ isVerified: true }).toArray();
        const candidates = await nominationsCollection.aggregate([
          { $group: { _id: "$partyName", votes: { $sum: 1 } } }
        ]).toArray();

        return res.status(200).json({
          totalVoters,
          totalNominations,
          registeredVoters,
          candidates,
        });
      }

      // If route doesn't match any valid ones
      return res.status(404).json({ message: 'Not Found' });

    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Failed to retrieve data' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
