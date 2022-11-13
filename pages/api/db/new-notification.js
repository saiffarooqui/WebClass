import connectDatabase from '../../../lib/db';
import Notice from '../../../models/Notification'
connectDatabase();
async function handler(req, res) {
  if (req.method === 'POST') {
    const {studId,senderName,notice,seen} = req.body
    console.log(req.body)
    const newNotice = new Notice({
      studId: studId,
      senderName:senderName,
      notice: notice,
      seen: seen,
      onDate: new Date().toISOString()
    });
    console.log(newNotice)
    const result = await newNotice.save();
    return res.status(201).json({ message: 'Created Notice!', notice: result });
  }
}

export default handler;
