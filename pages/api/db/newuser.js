import User from '../../../models/User';
import connectDatabase from '../../../lib/db'
connectDatabase();
async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, role } = req.body;
    console.log(req.body);
    if (!email || !name || !role) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }
    const newStudent = new User({
      email: email,
      name: name,
      role: role,
      [role === 'mentor' ? 'designation' : 'department']:
        req.body.designation || req.body.department,
      image: req.body.image,
    });
    const result = await newStudent.save();
    res.status(201).json({ message: 'Created user!', student: result });
  }
}

export default handler;
