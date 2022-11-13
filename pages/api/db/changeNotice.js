import connectDatabase from '../../../lib/db';
import Notice from '../../../models/Notification'
connectDatabase();
async function handler(req, res) {
  if (req.method === 'POST') {
    const notice = await Notice.findById(req.body.id);
    if(notice)
    {
        await notice.delete();
        res.status(201).json({ message: 'Notice deleted'});
    }
  }
}

export default handler;
