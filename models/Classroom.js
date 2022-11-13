import mongoose from 'mongoose';

const studentIdsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
});

const CommentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const submissionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
});

const AssignmentsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  docUrl: [submissionSchema],
  totalScore: {
    type: Number,
    required: true,
  },
  comments: [CommentsSchema],
});

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
});

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  //   original participants of classroom
  studentIds: [studentIdsSchema],
  owner: {
    type: ownerSchema,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  attendance: [AttendanceSchema],
  assignments: [AssignmentsSchema],
});

export default mongoose.models.Classroom ||
  mongoose.model('Classroom', ClassroomSchema);
