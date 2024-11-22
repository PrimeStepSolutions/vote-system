import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        // At least 18 years old
        return (new Date().getFullYear() - v.getFullYear()) >= 18;
      },
      message: 'You must be at least 18 years old to register'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minLength: [10, 'Address must be at least 10 characters']
  },
  idNumber: {
    type: String,
    required: [true, 'Government ID is required'],
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  biometricVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);