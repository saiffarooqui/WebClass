import connectDatabase from '../../../lib/db';
import Classroom from '../../../models/Classroom';

connectDatabase();
async function handler(req, res) {
  if (req.method === 'POST') {
    const { assignmentId, classroomId, score, userId } = req.body;

    const classroom = await Classroom.findOne({ _id: classroomId });

    console.log(classroom);

    const assignment = classroom.assignments.find(
      (assignment) => assignment._id.toString() === assignmentId
    );

    const submission = assignment.docUrl.find(
      (submission) => submission.userId === userId
    );

    submission.score = score;

    await classroom.save();

    res.status(201).json({ message: 'Score added' });
  }
}

export default handler;
