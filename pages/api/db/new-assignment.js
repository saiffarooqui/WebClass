import Classroom from '../../../models/Classroom';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, dueDate, classroomId, totalScore } = req.body;

    const classRoom = await Classroom.findById(classroomId);

    if (!classRoom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const newAssignment = {
      title,
      description,
      dueDate,
      totalScore,
    };

    classRoom.assignments.push(newAssignment);

    await classRoom.save();

    res
      .status(201)
      .json({ message: 'Created Assignment!', assignment: newAssignment });
  }
}

export default handler;
