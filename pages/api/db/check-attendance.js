import Classroom from '../../../models/Classroom';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { classroomId, attendanceData } = req.body;

    console.log(attendanceData);
    console.log(classroomId);

    const classroom = await Classroom.findOne({ _id: classroomId });

    console.log(classroom);

    classroom.attendance.push(...attendanceData);

    await classroom.save();

    res.status(201).json({ message: 'Attendance added' });
  }
}

export default handler;
