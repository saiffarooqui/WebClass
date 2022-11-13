import React, { useState } from "react";
import BookCards from "../components/dashboard/classroom/BookCards";
import { getSession } from "next-auth/react";
import AISupport from "../components/dashboard/classroom/AISupport";
import User from "../models/User";
import GitCards from "../components/dashboard/classroom/GItCards";
import connectDatabase from "../lib/db";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Box,
  useBoolean,
  HStack,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  Textarea,
  FormHelperText,
  Flex,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverAnchor,
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";
export default function Home({ userData, ...props }) {
  const parsedData = JSON.parse(userData);
  let [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const [githubData, setGithubData] = useState("");
  const [booksData, setBookData] = useState("");

  async function onSave(event) {
    event.preventDefault();
    if (value.trim() === ""){
      setValue("");
      toast.error("Enter a Note!!");
      return;
    }
    if (title.trim() === "") {
      setValue("");
      toast.error("Enter the title");
      return;
    }
    const toastId = toast.loading("Loading...");
    try {
      const res = await fetch("/api/addnotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: value,
          email: session.user.email,
        }),
      });
      const result = await res.json();
      setValue("");
      setTitle("");
      toast.dismiss(toastId);
      toast.success("Note Saved", {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Something went wrong", {
        id: toastId,
      });
    }
  }
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };
  async function onFind(event) {
    event.preventDefault();

    if (search.trim() === "") {
      toast.error("Enter something to search", {
        id: toastId,
      });
      return;
    }
    const toastId = toast.loading("Loading...");
    try {
      const github = await fetch(`api/github/?keyword=${search}`);
      setGithubData(await github.json());
      const books = await fetch(`api/books/?keyword=${search}`);
      setBookData(await books.json());
      setSearch("");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong", {
        id: toastId,
      });
    }
    toast.dismiss(toastId);
    toast.success("Resources For you", {
      id: toastId,
    });
  }
  const [isEditing, setIsEditing] = useBoolean();
  const [title, setTitle] = React.useState("");
  return (
    <DashboardLayout
      role={parsedData.role}
      id={parsedData._id}
      notifications={"empty"}
    >
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 2, md: 5 }}
          py={{ base: 10, md: 16 }}
        >
          <Heading
            fontWeight={700}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Note Maker
          </Heading>
          <Text color={"gray.500"}>
            Enter text to store as notes. Users can also use AI-powered Auto
            Note maker.
          </Text>

          <FormControl id="about" mt={1}>
            {/* <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Note maker
            </FormLabel> */}
            <Popover
              isOpen={isEditing}
              onOpen={setIsEditing.on}
              onClose={setIsEditing.off}
              closeOnBlur={false}
              isLazy
              lazyBehavior="keepMounted"
            >
              <HStack my={"4"}>
                <PopoverAnchor>
                  <Input
                    w="auto"
                    value={title}
                    display="inline-flex"
                    isDisabled={!isEditing}
                    defaultValue=""
                    placeholder="Enter Title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </PopoverAnchor>

                <PopoverTrigger>
                  <Button h="40px" colorScheme="pink">
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </PopoverTrigger>
              </HStack>
            </Popover>
            <Textarea
              value={value}
              placeholder="Add text..."
              onChange={handleInputChange}
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: "sm",
              }}
            />
            <FormHelperText>Enter notes here.</FormHelperText>
          </FormControl>

          <Flex>
            <Button
              w="7rem"
              colorScheme="green"
              variant="solid"
              onClick={onSave}
            >
              Save Note
            </Button>
            <Spacer />
            <AISupport role={parsedData.role} />
          </Flex>

          {/* <Stack
            direction={'column'}
            spacing={1}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          ></Stack> */}
          <FormControl as={GridItem} colSpan={6}>
            <FormLabel
              htmlFor="search"
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: "gray.50",
              }}
            >
              Want resources? Enter a keyword and get recommended reference
              material
            </FormLabel>
            <Input
              type="text"
              name="search"
              id="search"
              focusBorderColor="brand.400"
              shadow="sm"
              size="sm"
              w="full"
              rounded="md"
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormControl>
          <Button w="10rem" colorScheme="red" variant="solid" onClick={onFind}>
            Get Resources
          </Button>
        </Stack>
        {booksData !== "" && (
          <>
            <BookCards data={booksData} />
            <GitCards data={githubData} />
          </>
        )}
      </Container>
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
  return {
    props: {
      userData_id: JSON.stringify(userData._id),
      userData: JSON.stringify(userData),
    },
  };
}
