import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://jayanththalla33:bljw5G3RzwKsWnkE@cluster0.mongodb.net/voter-registration?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Voting logic
    const { candidateId } = req.body;

    try {
      await client.connect();
      const db = client.db('voter-registration');
      const nominationsCollection = db.collection('nominations');

      // Increment the vote count for the candidate
      const result = await nominationsCollection.updateOne(
        { id: candidateId }, // Find the candidate by ID
        { $inc: { votes: 1 } } // Increment the votes by 1
      );

      if (result.modifiedCount > 0) {
        return res.status(200).json({ success: true, message: 'Vote recorded successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Candidate not found' });
      }
    } catch (error) {
      console.error('Error in voting:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'GET') {
    // Fetch voting results (for admin)
    try {
      await client.connect();
      const db = client.db('voter-registration');
      const nominationsCollection = db.collection('nominations');

      const votingResults = await nominationsCollection.find().toArray();

      // Send the list of candidates with their vote counts
      return res.status(200).json(votingResults);
    } catch (error) {
      console.error('Error fetching voting results:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch results' });
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
