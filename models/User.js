import mongoose from 'mongoose';

const ClassroomSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
  },

  classRooms: [ClassroomSchema],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
