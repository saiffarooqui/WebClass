import { getSession } from "next-auth/react";
import Head from "next/head";
import DashboardLayout from "../../layout/DashboardLayout";
import ClassroomCard from "../../components/dashboard/ClassroomCard";
import User from "../../models/User";
import connectDatabase from "../../lib/db";
import Classroom from "../../models/Classroom";
import Notice from "../../models/Notification";
import { Flex, Stack, Text } from "@chakra-ui/react";
function DashboardPage({ userData, classRooms, notifications }) {
  const parsedUser = JSON.parse(userData);
  const parsedClassRooms = JSON.parse(classRooms);
  let parsednotices = 'empty'
  if(notifications)
  parsednotices = JSON.parse(notifications)
  return (
    <DashboardLayout
      role={parsedUser.role}
      id={parsedUser._id}
      notifications={parsednotices}
    >
      <Head>
          <title>WebClass - Dashboard</title>
      </Head>
      <Stack p={10}>
        <Text fontSize={"2xl"} fontWeight="medium">
          Your Classrooms
        </Text>

        <Flex gap={10}>
          {parsedClassRooms.map((classRoom) => (
            <ClassroomCard
              id={classRoom._id}
              key={classRoom._id}
              title={classRoom.name}
              noOfStudents={classRoom.studentIds.length}
            />
          ))}
        </Flex>
      </Stack>
    </DashboardLayout>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  connectDatabase();
  const userData = await User.findOne({ email: session.user.email });
  let notifications = "empty";
 
  if (userData === null || !userData) {
    return {
      redirect: {
        destination: "/dashboard/new-user",
        permanent: false,
      },
    };
  }
  if (userData.role === "student") {
    notifications = await Notice.find({ studId: userData._id }).sort({
      onDate: -1,
    });
  }
  let classRooms = [];
  if (userData.role === "mentor") {
    classRooms = await Classroom.find({ "owner.id": userData._id });
  } else {
    classRooms = await Classroom.find({
      studentIds: { $elemMatch: { id: userData._id } },
    });
  }
  return {
    props: {
      userData: JSON.stringify(userData),
      classRooms: JSON.stringify(classRooms),
      notifications: JSON.stringify(notifications),
    },
  };
}

export default DashboardPage;
