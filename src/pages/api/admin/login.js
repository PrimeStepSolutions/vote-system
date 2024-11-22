import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://jayanththalla33:bljw5G3RzwKsWnkE@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }); // Removed deprecated options

// Maintain a single database connection for reuse
let db;

async function connectToDb() {
  if (!db) {
    try {
      await client.connect();
      console.log("Connected to MongoDB Atlas");
      db = client.db('voter-registration');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Ensure the database connection is established
      await connectToDb();

      const admins = db.collection('admins');

      // Find the admin by email
      const admin = await admins.findOne({ email });

      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If passwords match, return success (you can generate and return a JWT token here)
      return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
