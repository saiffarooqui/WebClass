import { GrAdd } from "react-icons/gr";
import moment from "moment";
import Notifications from "react-notifications-menu";
const DEFAULT_NOTIFICATION = {
  image: "",
  message: "Welcome!!",
  detailPage: "WebClass",
  receivedTime: "anytime",
};
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Logo from "../ui/Logo";
import JoinModal from "./join-classroom/Modal";
import { useRouter } from "next/router";
import CustomCard from "../CustomCard";
export default function Nav({ role, id, notifications }) {
  const session = useSession();
  const data = [DEFAULT_NOTIFICATION];
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  //if there are notfications add it to array
  if (notifications && notifications !== "empty") {
    notifications.forEach((element) => {
      data.push({
        image: element._id,
        message: element.notice,
        receivedTime: moment(element.onDate).fromNow(true),
        detailPage: element.senderName,
        id: element.id,
      });
    });
  }
  return (
    <>
      <Box bg={"gray.100"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Logo />
          </Box>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {
                <>
                  {role === "student" && (
                    <>
                      <Box my={"2"}>
                        <Notifications
                          data={data}
                          notificationCard={CustomCard}
                          header={{
                            title: "Notifications",
                            option: {
                              text: "View All",
                              onClick: () => console.log("Clicked"),
                            },
                          }}
                        />
                      </Box>
                      <Link href="/mynotes">
                        <Button
                          size={"sm"}
                          variant="solid"
                          colorScheme={"blue"}
                          color={"white"}
                        >
                          Notes
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button
                    leftIcon={<GrAdd color={"white"} />}
                    variant="solid"
                    colorScheme={"blue"}
                    color={"white"}
                    onClick={onOpen}
                    size={"sm"}
                  >
                    {role === "student" ? "Join Classroom" : "Create classroom"}
                  </Button>
                  <Link href="/chat">
                    <Button size={"sm"} colorScheme={"purple"}>
                      Chatspace
                    </Button>
                  </Link>
                </>
              }

              <JoinModal
                id={id}
                role={role}
                isOpen={isOpen}
                onClose={onClose}
              />

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  {session.status !== "loading" && (
                    <Avatar size={"sm"} src={session.data?.user.image} />
                  )}
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    {session.status !== "loading" && (
                      <Avatar size={"2xl"} src={session.data?.user.image} />
                    )}
                  </Center>
                  <br />
                  <Center>
                    <p>{session.data?.user.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
