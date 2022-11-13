import * as React from "react";
import Notes from "../models/Notes";
import Note from "../components/dashboard/Note";
import User from "../models/User";
import { getSession } from "next-auth/react";
import connectDatabase from "../lib/db";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Alert,
  Text,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  HStack,
  VStack,
  Link,
  Heading,
  Button,
} from "@chakra-ui/react";

const ProjectCard = ({ userData, role, id }) => {
  //console.log(JSON.parse(userData));
  const data = JSON.parse(userData);
  const userRole = JSON.parse(role);
  const userId = JSON.parse(id);
  var i = 0;
  return (
    <DashboardLayout role={userRole} id={userId} notifications={"empty"}>
      <Container maxW="4xl" p={{ base: 5, md: 10 }}>
        {data.length === 0 ? (
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="250px"
          >
            <AlertIcon boxSize="40px" mr={0} mt={1} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No Notes Found
            </AlertTitle>

            <AlertDescription maxWidth="sm">
              <VStack>
                <Text as="samp">Create notes with the help of AI</Text>
                <Link href="/notemaker">
                  <Button size={"sm"} colorScheme={"green"} m={"2"}>
                    Create Notes
                  </Button>
                </Link>
              </VStack>
            </AlertDescription>
          </Alert>
        ) : (
          <HStack
            w={"full"}
            m={10}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Heading w="100%" textAlign={"left"} fontWeight="normal">
              Your notes
            </Heading>
            <Link href="/notemaker">
              <Button size={"sm"} colorScheme={"green"}>
                Create Notes
              </Button>
            </Link>
          </HStack>
        )}
        <VStack spacing={4}>
          {data.map(({ _id, title, content, createdOn }) => {
            i = i + 1;
            return (
              <Note
                title={title}
                content={content}
                serial={i}
                date={createdOn}
                key={_id}
              />
            );
          })}
        </VStack>
      </Container>
    </DashboardLayout>
  );
};

export default ProjectCard;

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  // console.log('amisha', session);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
  connectDatabase();
  const user = await User.findOne({ email: session.user.email });
  // console.log(user)
  const userData = await Notes.find({ authorId: user._id }).sort({
    createdOn: -1,
  });
  // console.log(userData);
  // console.log("USER",user)
  return {
    props: {
      userData: JSON.stringify(userData),
      role: JSON.stringify(user.role),
      id: JSON.stringify(user._id),
    },
  };
}
