// pages/api/verify-otp.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://jayanththalla33:bljw5G3RzwKsWnkE@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, otp } = req.body;

    try {
      await client.connect();
      const db = client.db('voter-registration');
      const collection = db.collection('users');
      
      const user = await collection.findOne({ email });

      if (user && String(user.otp) === String(otp)) {
        await collection.updateOne(
          { email },
          { $set: { isVerified: true }, $unset: { otp: "" } }
        );
        return res.status(200).json({ message: 'User verified successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
