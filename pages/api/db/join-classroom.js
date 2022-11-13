import connectDatabase from '../../../lib/db';
import Classroom from '../../../models/Classroom';
import User from '../../../models/User';

connectDatabase();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { code, studentId, studentName, image, studentEmail } = req.body;

    const classRoom = await Classroom.findOne({
      code: code,
    });

    if (!classRoom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const studentExists = classRoom.studentIds.find(
      (doc) => doc.id === studentId
    );

    if (studentExists) {
      return res.status(422).json({ message: 'Student already exists' });
    }

    classRoom.studentIds.push({
      id: studentId,
      name: studentName,
      image: image,
      email: studentEmail,
    });

    const updatedCLassRoom = await classRoom.save();

    // update User model as well
    const user = await User.findOne({ _id: studentId });

    user.classRooms.push({
      id: classRoom._id,
      name: classRoom.name,
    });

    await user.save();

    return res.status(201).json({ message: 'Student added successfully' });
  }
}

export default handler;
