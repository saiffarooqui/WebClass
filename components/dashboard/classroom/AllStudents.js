import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  FormLabel,
  Box,
  FormControl,
  GridItem,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
export default function AllStudents({ data }) {
  console.log(data);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const btnRef = React.useRef();
  const [characterInput, setCharacterInput] = useState("");
  const [result, setResult] = useState();
  async function onSubmit(event) {
    event.preventDefault();
    setResult("");
    if (characterInput.trim() === "") return;
    const toastId = toast.loading("Loading...");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ character: characterInput }),
      });
      const display = await response.json();
      setResult(display.result);
      toast.success("Done", {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error occured", {
        id: toastId,
      });
    } finally {
      toast.dismiss(toastId);
    }
    setCharacterInput("");
  }
  return (
    <div>
      <Button ref={btnRef} colorScheme="teal" size={"sm"} onClick={onOpen}>
        Students
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Student&apos; Performance</DrawerHeader>
          <DrawerBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((student) => (
                  <Tr key={student.id} cursor="pointer">
                    <Link href={`/StudentLearningCurve/${student.id}`}>
                      <Td>{student.name}</Td>
                    </Link>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
