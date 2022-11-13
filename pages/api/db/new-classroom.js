import connectDatabase from '../../../lib/db';
import Classroom from '../../../models/Classroom';
import User from '../../../models/User';

connectDatabase();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, mentor, mentorId, code, startDate, endDate, email, image } =
      req.body;

    const newClassRoom = new Classroom({
      name,
      owner: {
        name: mentor,
        email,
        image,
        id: mentorId,
      },
      startDate,
      endDate,
      code,
    });

    const result = await newClassRoom.save();

    res.status(201).json({ message: 'Classroom created successfully', result });
  }
}

export default handler;
