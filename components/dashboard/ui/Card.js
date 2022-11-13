import {
  Box,
  Button,
  FormControl,
  GridItem,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiAlarmExclamation } from "react-icons/bi";
import SetScoreModal from "../classroom/SetScoreModal";

function Card({
  title,
  chakra,
  description,
  dueDate,
  status,
  role,
  userId,
  assignmentId,
  classroomId,
  totalScore,
  assignedScore,
  docs,
  allUsers,
}) {
  const [imageSrc, setImageSrc] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadData, setUploadData] = useState();
  const [isOpen2, setIsOpen] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toggleOpen = () => setIsOpen(!isOpen2);
  const [score, setScore] = useState(0);

  const router = useRouter();

  console.log("classroomId", classroomId);
  console.log("assignmentId", assignmentId);

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );
    console.log("fileInput", fileInput);

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "inspirathon");
    console.log("Yess doing");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/drfsgcpng/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());
    console.log("Done");
    console.log(data.secure_url);
    setImageSrc(data.secure_url);
    setUploadData(data);
    try {
      const res = await fetch("/api/db/upload-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          assignmentId,
          classroomId,
          url: data.secure_url,
        }),
      });

      const json = await res.json();
      console.log(json);

      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GridItem>
      <Box
        rounded={"lg"}
        shadow={"md"}
        border={"1px"}
        p={5}
        borderColor={"gray.300"}
      >
        <HStack justify={"space-between"} align={"flex-start"}>
          <Stack>
            <Text fontSize={"1rem"} fontWeight={"medium"}>
              {title}
            </Text>
            {!isOpen2 && (
              <Text fontSize="sm" noOfLines={{ base: 2 }}>
                {description}
              </Text>
            )}
            {isOpen2 && <Text fontSize="sm">{description}</Text>}
            <Button
              size="sm"
              variant="link"
              colorScheme="slate"
              textDecoration="underline"
              onClick={toggleOpen}
            >
              {!isOpen2 ? "Show More" : "Show less"}
            </Button>
          </Stack>

          {role !== "mentor" ? (
            <Stack>
              <form method="post" onSubmit={handleOnSubmit}>
                <input type="file" name="file" id="file" />
                <Button
                  size={"xs"}
                  disabled={status.find((s) => s.userId === userId)}
                  type="submit"
                >
                  Upload
                </Button>
              </form>
            </Stack>
          ) : (
            <HStack>
              <Button onClick={onOpen} size={"sm"} fontSize={"xs"} px={6}>
                Assign Score
              </Button>

              <SetScoreModal
                classroomId={classroomId}
                assignmentId={assignmentId}
                allUsers={allUsers}
                submissions={docs}
                isOpen={isOpen}
                onClose={onClose}
              />
            </HStack>
          )}
        </HStack>

        <HStack align="center" justify={"space-between"} mt={3}>
          <HStack>
            <HStack bgColor={"orange.300"} px={2} py={1} rounded={"md"}>
              <Text color="white" fontWeight={"medium"}>
                Status:
              </Text>
              <Text color="white">
                {role === "student"
                  ? !status.find((s) => s.userId === userId)
                    ? "Submission pending"
                    : "Submitted"
                  : `${status.length} submissions`}
              </Text>
            </HStack>
          </HStack>

          {role === "student" && (
            <HStack
              bgColor={"aqua"}
              width={"fit-content"}
              mx={"auto"}
              px={2}
              py={1}
              align={"center"}
              justify={"center"}
              rounded={"md"}
            >
              <Stack>
                <Text fontSize={"sm"} fontWeight={500}>
                  Score:{" "}
                </Text>
              </Stack>
              <Stack rounded={"full"}>
                <Text color={"black"} fontWeight={500}>
                  {assignedScore || "?"}/{totalScore}
                </Text>
              </Stack>
            </HStack>
          )}

          <HStack
            align="center"
            bgColor={"red.300"}
            px={3}
            py={1}
            rounded={"lg"}
          >
            <BiAlarmExclamation size={20} color="white" />

            <Text color={"white"} fontWeight={"medium"}>
              Due Date: {new Date(dueDate).toLocaleDateString()}
            </Text>
          </HStack>
        </HStack>
      </Box>
    </GridItem>
  );
}

export default Card;
