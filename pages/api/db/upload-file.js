import Classroom from '../../../models/Classroom';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, url, classroomId } = req.body;

    const classRoomData = await Classroom.findOne({ _id: classroomId });

    const newSubmission = {
      userId: userId,
      url: url,
    };

    console.log(classRoomData);

    // find if submission already exists
    const submissionIndex = classRoomData.assignments
      .find((assignment) => assignment._id.toString() === req.body.assignmentId)
      .docUrl?.findIndex((docUrl) => docUrl.userId === userId);

    console.log(submissionIndex);

    // if submission exists, update it
    if (submissionIndex >= 0) {
      classRoomData.assignments
        .find(
          (assignment) => assignment._id.toString() === req.body.assignmentId
        )
        .docUrl.splice(submissionIndex, 1, newSubmission);

      console.log(classRoomData);

      await classRoomData.save();

      return res.status(200).json({ message: 'Submission updated' });
    }

    classRoomData.assignments
      .find((assignment) => assignment._id.toString() === req.body.assignmentId)
      .docUrl.push(newSubmission);

    await classRoomData.save();

    return res.status(201).json({ message: 'Submission added' });
  }
}

export default handler;