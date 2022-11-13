import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { getSession } from "next-auth/react";
import connectDatabase from "../../lib/db";
import User from "../../models/User";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  FormLabel,
  Box,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  GridItem,
  Input,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Lorem,
  Alert,
  AlertTitle,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardNavBar from "../../components/dashboard/DashboardNavBar";
import Classroom from "../../models/Classroom";
import { Button } from "@chakra-ui/react";
import Head from "next/head";
// export const data = [
//   ['Class names', 'Next.js 101', 'Physics 101', 'Chemistry 101'],
//   ['A', 37.8, 80.8, 41.8],
// ];
export const options = {
  title: "Students Learning Curve",
  subtitle: "in different classes accordng to thier recent 5 assignment marks",
  hAxis: {
    title: "Assigment",
  },
  vAxis: {
    title: "Marks",
  },
  curveType: "function",
};
export default function Cal({ Data, studId, role, id }) {
  let data = [];
  const [characterInput, setCharacterInput] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  async function onSubmit(event) {
    event.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      const res = await fetch("/api/db/new-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studId: JSON.parse(studId),
          senderName: session.user.name,
          notice: characterInput,
          seen: false,
        }),
      });
      const result = await res.json();
      toast.success("Sent", {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        id: toastId,
      });
    }
    toast.dismiss(toastId);
    setCharacterInput("");
    onClose();
  }
  //console.log(Data);
  Data = JSON.parse(Data);
 //console.log(Data);
  //check if data is present
  if (Object.keys(Data).length != 0) {
    //extract the classes
    let classes = ["Class Names"];
    Data = Object.entries(Data);
    let a = Array(Data.length).fill(undefined);
    //All recent 5 assignments
    let ass = [
      ["A1", ...a],
      ["A2", ...a],
      ["A3", ...a],
      ["A4", ...a],
      ["A5", ...a],
    ];
    let k = 0;
    Data.forEach((d, j) => {
      classes.push(d[0]);
      k = 0; //using k to assign assignments to keep the line instead of points
      d[1].forEach((e, i) => {
        if (e && k <= 4) {
          ass[k][j + 1] = e;
          k = k + 1;
        }
      });
    });
    data.push(classes);
    data.push(ass[0]);
    data.push(ass[1]);
    data.push(ass[2]);
    data.push(ass[3]);
    data.push(ass[4]);
    //console.log(data);
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notify your student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl as={GridItem} colSpan={6}>
              <FormLabel
                htmlFor="search"
                fontSize="lg"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Write a short message
              </FormLabel>
              <Input
                type="text"
                name="search"
                id="search"
                autoComplete="search"
                focusBorderColor="brand.400"
                shadow="sm"
                size="lg"
                w="full"
                rounded="md"
                onChange={(e) => setCharacterInput(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSubmit}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Head>
        <title>Student Learning Curve</title>
      </Head>
      <DashboardNavBar
        role={JSON.parse(role)}
        id={JSON.parse(id)}
        notifications={"empty"}
      />
      <Box m="2" p="2">
        <Button colorScheme="teal" size={"sm"} onClick={onOpen}>
          Notify
        </Button>
        {Object.keys(Data).length === 0 ? (
          <Alert status="error" m={"4"} w={"300px"}>
            <AlertTitle>No Data</AlertTitle>
          </Alert>
        ) : (
          <Chart
            chartType="LineChart"
            width="100%"
            height="500px"
            data={data}
            options={options}
          />
        )}
      </Box>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { studid } = ctx.params;
  connectDatabase();
  const session = await getSession({ req: ctx.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
  let data = {};
  const allClassrooms = await Classroom.find({
    studentIds: { $elemMatch: { id: studid } },
  });
  //console.log("Class",allClassrooms,session.user.email)
  const user = await User.findOne({ email: session.user.email });
  allClassrooms.forEach((classRoom) => {
    let allass = classRoom.assignments;
    allass.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    allass.forEach((assignment) => {
      let alldocs = assignment.docUrl;
      let ts = assignment.totalScore;
      alldocs.forEach((doc) => {
        if (doc.userId === studid&&doc.score) {
          if(data[classRoom.name]==undefined) data[classRoom.name] = [];
          data[classRoom.name].push((doc.score / ts) * 100);
        }
      });
    });
  });
  //console.log(data);
  return {
    props: {
      Data: JSON.stringify(data),
      studId: JSON.stringify(studid),
      role: JSON.stringify(user.role),
      id: JSON.stringify(user._id),
    },
  };
}
