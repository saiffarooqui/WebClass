import connectDatabase from '../../lib/db';
import Notes from '../../models/Notes';
import User from '../../models/User';

connectDatabase();
async function handler(req, res) {
  if (req.method === 'POST') {
    let id = '';
    let title = '';
    let content = '';
    const userData = await User.findOne({ email: req.body.email });
    if (userData.role !== 'student') {
      return;
    }
    id = userData._id;
    title = req.body.title;
    content = req.body.content;
    const newNote = new Notes({
      authorId: id,
      title: title,
      content: content,
      createdOn: new Date().toISOString()
    });
    //console.log( new Date().toISOString(),newNote)
    const result = await newNote.save();
    return res.status(201).json({ message: 'Created Note!', note: result });
  }
}

export default handler;
