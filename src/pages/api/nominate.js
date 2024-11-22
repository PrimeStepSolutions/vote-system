import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

// Connection URI (Consider moving this to environment variables)
const uri = process.env.MONGODB_URI || "mongodb+srv://jayanththalla33:bljw5G3RzwKsWnkE@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";

// Create a MongoDB client instance
let client = null;
let isConnecting = false;

// Initialize MongoDB connection
async function connectToDatabase() {
  try {
    if (client && client.topology && client.topology.isConnected()) {
      return client;
    }

    if (!isConnecting) {
      isConnecting = true;
      client = new MongoClient(uri);
      await client.connect();
      isConnecting = false;
    }

    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnecting = false;
    throw new Error('Failed to connect to database');
  }
}

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'thallajayanth12@gmail.com',
    pass: process.env.EMAIL_PASS || 'zzrf nlkv pmbe kwld'
  }
};

// Send OTP email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport(emailConfig);

  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Nomination OTP Verification',
      text: `Your OTP for nomination verification is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Nomination OTP Verification</h2>
          <p>Your OTP for nomination verification is:</p>
          <h1 style="color: #4A90E2;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
}

const partySymbols = ['Flag', 'Landmark', 'CloudLightning', 'Hexagon', 'Star', 'Target'];

export default async function handler(req, res) {
  try {
    // Connect to database
    const dbClient = await connectToDatabase();
    const db = dbClient.db('voter-registration');
    const nominations = db.collection('nominations');

    if (req.method === 'POST') {
      const { name, email, reason, otp, partyName } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // OTP verification
      if (otp) {
        const nomination = await nominations.findOne({ 
          email,
          otp: String(otp),
          otpExpiry: { $gt: new Date() }
        });

        if (!nomination) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await nominations.updateOne(
          { email },
          { 
            $set: { isVerified: true },
            $unset: { otp: '', otpExpiry: '' }
          }
        );

        return res.status(200).json({ message: 'Nomination verified successfully' });
      }

      // New nomination or resend OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      const partySymbol = partySymbols[Math.floor(Math.random() * partySymbols.length)];
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const existingNomination = await nominations.findOne({ email });

      if (existingNomination) {
        await nominations.updateOne(
          { email },
          { 
            $set: {
              otp: generatedOtp,
              otpExpiry,
              partyName,
              partySymbol,
              updatedAt: new Date()
            }
          }
        );
      } else {
        await nominations.insertOne({
          name,
          email,
          reason,
          otp: generatedOtp,
          otpExpiry,
          partyName,
          partySymbol,
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await sendOtpEmail(email, generatedOtp);
      
      return res.status(200).json({
        message: existingNomination ? 'OTP resent successfully' : 'Nomination submitted and OTP sent'
      });

    } else if (req.method === 'GET') {
      const allNominations = await nominations
        .find({ isVerified: true })
        .project({
          otp: 0,
          otpExpiry: 0
        })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(allNominations);

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}