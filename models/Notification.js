import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  studId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  notice: {
    type: String,
    required: true,
  },
  seen:{
    type:Boolean,
    require:true
  },
  onDate: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
