import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Card from "../ui/Card";

import AttendanceCal from "../../data-graphs/AttendanceCal";
import AllStudents from "./AllStudents";
import { BsPlus } from "react-icons/bs";
import NewClassRoomModal from "./NewClassRoomModal";
import Attendance from "./Attendance";

function ClassRoomPanel({ classRoomData, userData, allUsers }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isAttendanceTaken = classRoomData.attendance.some(
    (attendance) => new Date(attendance.date).getDay() === new Date().getDay()
  );

  const attendanceToday = classRoomData.attendance.filter(
    (attendance) => new Date(attendance.date).getDay() === new Date().getDay()
  );

  return (
    <Stack width={"90%"} marginX={"auto"} marginY={"2rem"}>
      <Box
        width={"full"}
        height={"7rem"}
        rounded={"lg"}
        padding={"1rem"}
        marginX={"auto"}
        bgGradient={
          "linear-gradient(to right top, #5b89ce, #6f7dd0, #896dcb, #a559be, #be3da8)"
        }
        display={"flex"}
        flexDirection="column"
      >
        <HStack justify="flex-end">
          <Button
            onClick={() => {
              // clipboard api
              navigator.clipboard.writeText(
                `Here is the code to my classroom, please join asap - ${classRoomData.code}`
              );
            }}
            size={"xs"}
          >
            Code: {classRoomData.code}
          </Button>
        </HStack>
        <HStack justify={"space-between"} position={"relative"}>
          <VStack spacing={0} align={"flex-start"} justify={"flex-start"}>
            <Text fontSize={"1.5rem"} color={"white"} fontWeight={"bold"}>
              Classroom - {classRoomData.name}
            </Text>
            <Text fontWeight={"light"} fontSize={"1rem"} color={"white"}>
              Mentor Name: {classRoomData.owner.name}
            </Text>
          </VStack>

          <Stack position="absolute" right={10} bottom={-150}>
            <Image
              width={200}
              height={200}
              alt="profile"
              src={classRoomData.owner.image}
            />
          </Stack>
        </HStack>
      </Box>
      <Box>
        {classRoomData.studentIds.length > 0 && (
          <AvatarGroup size="md" max={2}>
            {classRoomData.studentIds.map((studentId) => (
              <Avatar
                key={studentId.name}
                name={studentId.name}
                src={studentId.image}
              />
            ))}
          </AvatarGroup>
        )}
      </Box>

      {/* Upcoming assignments */}
      <div style={{ marginTop: "7rem" }}>
        <HStack justify={"space-between"}>
          <Text fontSize={"1rem"} color={"gray.700"} fontWeight={"bold"}>
            Upcoming assignments
          </Text>

          {userData.role === "mentor" && (
            <>
            <HStack justify={"space-between"}>
            <AllStudents data={classRoomData.studentIds} />
              <Button
                onClick={onOpen}
                variant={"solid"}
                colorScheme={"blue"}
                size={"sm"}
                leftIcon={<BsPlus size={"30px"} />}
              >
                New Assignment
              </Button>
            </HStack>
              
            </>
          )}

          <NewClassRoomModal
            classroomId={classRoomData._id}
            isOpen={isOpen}
            onClose={onClose}
          />
        </HStack>

        <br />
        {classRoomData.assignments.length === 0 && (
          <Text
            fontSize={".7rem"}
            mx={"auto"}
            width={"fit-content"}
            color={"gray.400"}
            fontWeight={"normal"}
          >
            No assignments yet
          </Text>
        )}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {classRoomData.assignments.length > 0 &&
            classRoomData.assignments
              .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
              .map((assignment) => (
                <Card
                  allUsers={allUsers}
                  classroomId={classRoomData._id}
                  assignmentId={assignment._id}
                  role={userData.role}
                  userId={userData._id}
                  key={assignment._id}
                  title={assignment.title}
                  description={assignment.description}
                  dueDate={new Date(assignment.dueDate).toLocaleString()}
                  status={assignment?.docUrl}
                  totalScore={assignment.totalScore}
                  assignedScore={
                    assignment.docUrl.find((doc) => doc.userId === userData._id)
                      ?.score
                  }
                  docs={assignment.docUrl}
                />
              ))}
        </Grid>
        <AttendanceCal data={classRoomData.attendance} />
      </div>

      {/* Attendance */}
      {userData.role === "mentor" && (
        <div style={{ marginTop: "5rem" }}>
          <Text fontSize={"1rem"} color={"gray.700"} fontWeight={"bold"}>
            {!isAttendanceTaken && "Attendance"}
          </Text>

          <br />

          <HStack>
            {!isAttendanceTaken && (
              <Box
                bgColor={"blue.300"}
                width={"fit-content"}
                px={3}
                py={1}
                rounded={"lg"}
              >
                <Text fontSize={"1rem"} color={"white"}>
                  Day{" "}
                  {new Date().getDate() -
                    new Date(classRoomData.startDate).getDate()}
                </Text>
              </Box>
            )}

            {!isAttendanceTaken && (
              <Attendance
                classroomId={classRoomData._id}
                studentIds={classRoomData.studentIds}
              />
            )}
          </HStack>
          <HStack>
            {isAttendanceTaken && (
              <Box my={4} border="1px" p={4} rounded={"md"} shadow={"lg"}>
                <HStack ml={6} mb={4} fontSize={"1rem"} fontWeight="bold">
                  <Text>Attendance Report</Text>
                  <Box bgColor={"green.300"} px={2} py={1} rounded={"md"}>
                    <Text color="white">
                      Day{" "}
                      {new Date().getDate() -
                        new Date(classRoomData.startDate).getDate()}
                    </Text>
                  </Box>
                </HStack>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Student Name</Th>
                      <Th>Attendance</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {classRoomData.studentIds.map((student) => (
                      <Tr key={student._id}>
                        <Td>{student.name}</Td>
                        <Td>
                          {attendanceToday.find(
                            (attendance) => attendance.userId === student.id
                          )
                            ? "Present"
                            : "Absent"}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </HStack>
        </div>
      )}
    </Stack>
  );
}

export default ClassRoomPanel;
