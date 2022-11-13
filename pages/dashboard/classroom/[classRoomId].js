import { getSession } from 'next-auth/react';
import Head from 'next/head';
import ClassRoomPanel from '../../../components/dashboard/classroom/ClassRoomPanel';
import DashboardLayout from '../../../layout/DashboardLayout';
import connectDatabase from '../../../lib/db';
import Classroom from '../../../models/Classroom';
import User from '../../../models/User';
import Notice from '../../../models/Notification'

function ClassRoomPage({ classRoomData, userData, allUsers,notifications }) {
  const parsedClassRoomData = JSON.parse(classRoomData);
  const parsedUserData = JSON.parse(userData);
  const parsedAllUsers = JSON.parse(allUsers);
  const parsedNotifcations = JSON.parse(notifications);

  // console.log(parsedClassRoomData);

  return (
    <DashboardLayout role={parsedUserData.role} id={parsedUserData._id} notifications={ parsedNotifcations}>
      <Head>
        <title>Classroom - {parsedClassRoomData.name}</title>
      </Head>

      <ClassRoomPanel
        userData={parsedUserData}
        classRoomData={parsedClassRoomData}
        allUsers={parsedAllUsers}
      />
    </DashboardLayout>
  );
}

export async function getServerSideProps(ctx) {
  const { classRoomId } = ctx.params;

  connectDatabase();

  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }
  const classroonData = await Classroom.findOne({ _id: classRoomId });
  const userData = await User.findOne({ email: session.user.email });
  const allUsers = await User.find();
  let notifications= 'empty';
  if(userData.role==='student')
  {
    notifications = await Notice.find({studId:userData._id}).sort({onDate:-1})
  }
  //console.log("Stude",notifications)
  return {
    props: {
      classRoomData: JSON.stringify(classroonData),
      userData: JSON.stringify(userData),
      allUsers: JSON.stringify(allUsers),
      notifications:JSON.stringify(notifications)
    },
  };
}

export default ClassRoomPage;
