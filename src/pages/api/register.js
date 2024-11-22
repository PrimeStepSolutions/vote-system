import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// Hardcoded configuration
const MONGODB_URI = "mongodb+srv://jayanththalla33:jayanththalla33@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";
const EMAIL_USER = 'thallajayanth12@gmail.com';
const EMAIL_PASS = 'zzrf nlkv pmbe kwld';

// Create MongoDB client
const client = new MongoClient(MONGODB_URI);

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendOtpEmail(email, otp) {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP for Voter Registration',
      text: `Your OTP is ${otp}. Please use it to complete your registration.`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
}

// Helper function to establish database connection
async function connectToDatabase() {
  try {
    if (!client.connect) {
      await client.connect();
    }
    return client.db('voter-registration');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export default async function handler(req, res) {
  try {
    const { method } = req;
    const db = await connectToDatabase();

    switch (method) {
      case 'POST':
        return handlePost(req, res, db);
      case 'GET':
        return handleGet(req, res, db);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    // Don't close the connection after each request in production
    // as it can lead to performance issues
    if (process.env.NODE_ENV === 'development') {
      await client.close();
    }
  }
}

async function handlePost(req, res, db) {
  const { fullName, email, dateOfBirth, address, phoneNumber, idNumber, otp, candidateId } = req.body;

  // Handle voting
  if (candidateId) {
    return handleVoting(candidateId, db, res);
  }

  const collection = db.collection('users');

  // Verify OTP
  if (otp) {
    return verifyOtp(email, otp, collection, res);
  }

  // Input validation
  if (!email || !fullName || !dateOfBirth || !address || !phoneNumber || !idNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await collection.findOne({ email });
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    
    const userDetails = {
      fullName,
      email,
      dateOfBirth,
      address,
      phoneNumber,
      idNumber,
      otp: generatedOtp,
      createdAt: new Date(),
      isVerified: false,
    };

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already registered and verified' });
      }
      await collection.updateOne({ email }, { $set: { otp: generatedOtp } });
      await sendOtpEmail(email, generatedOtp);
      return res.status(200).json({ message: 'OTP resent to your email' });
    }

    await collection.insertOne(userDetails);
    await sendOtpEmail(email, generatedOtp);
    return res.status(201).json({ message: 'User registered and OTP sent' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

async function handleGet(req, res, db) {
  try {
    const collection = db.collection('users');
    const users = await collection.find({ isVerified: true }, {
      projection: {
        otp: 0, // Exclude sensitive data
        _id: 0,
      },
    }).toArray();
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
}

async function verifyOtp(email, otp, collection, res) {
  try {
    const existingUser = await collection.findOne({ email });
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (String(existingUser.otp) === String(otp)) {
      await collection.updateOne(
        { email },
        { 
          $set: { isVerified: true },
          $unset: { otp: "" },
        }
      );
      return res.status(200).json({ message: 'User verified successfully' });
    }
    
    return res.status(400).json({ message: 'Invalid OTP' });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: 'Verification failed' });
  }
}

async function handleVoting(candidateId, db, res) {
  try {
    const nominationsCollection = db.collection('nominations');
    const result = await nominationsCollection.updateOne(
      { id: candidateId },
      { $inc: { votes: 1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    return res.status(200).json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Voting error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
}
