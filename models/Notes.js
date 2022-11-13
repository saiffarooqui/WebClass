import mongoose from 'mongoose';

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Notes || mongoose.model('Notes', NotesSchema);
