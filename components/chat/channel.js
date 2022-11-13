import { useContext, useEffect } from "react";
import { ChatContext } from "../../lib/chat-context";
import {  CloseIcon } from "@chakra-ui/icons";
import moment from "moment";
import {
  Input,
  Button,
  HStack,
  Box,
  Flex,
  Heading,
  Alert,
  AlertTitle,
  AlertIcon,
  Stack,
  Text,
  theme,
  VStack,
} from "@chakra-ui/react";
export default function Channel() {
  const {
    user,
    channels,
    curChannel,
    updateCtx,
    resetCtx,
    joinChannel,
    channelNames,
    removeChannel,
  } = useContext(ChatContext);

  const selectChannel = (curChannel) => {
    updateCtx({ curChannel });
  };
  const checkJoin = () => {
    const el = document.querySelector("#join-channel");
    let val = (el.value || "").trim().toLowerCase();
    if (!val) return;
    el.value = "";
    val = val.replace(/ /g, "-");

    if (!channels[val]) {
      joinChannel(val);
    }
  };
  const checkEnter = (e) => {
    if (e.which === 13) checkJoin();
  };

  // Auto-join general channel when username is set
  useEffect(() => {
    if (user && !channels.general) {
      joinChannel("general");
    }
  }, [user]);
  const borderColor = "gray.300";
  return (
    <Box border='1px' borderColor={borderColor} p={2} overflow= "hidden"
    overflowY= "scroll" height={"calc(100vh)"}>
      <HStack alignItems={"center"} justifyContent={"space-between"} m={4}>
        <VStack>
          <i className="icon icon-2x icon-people" />
          <span>{user}</span>
        </VStack>
        <Button m={2} sze="xs" onClick={resetCtx}>
          Leave
        </Button>
      </HStack>
      <HStack  alignItems={"center"} justifyContent={"space-between"} m={2}>
        <Input
          id="join-channel"
          onKeyDown={checkEnter}
          placeholder="Channel name"
        />
        <Button size="md" onClick={checkJoin} colorScheme="blue">
          Join
        </Button>
      </HStack>

      {channelNames.length === 0 ? (
        <Alert status="info" m={2}>
          <AlertIcon />
          <AlertTitle>No Channel found</AlertTitle>
        </Alert>
      ) : (
        channelNames.map((name) => {
          const channel = channels[name];
          const lastMessage =
            channel && channel.messages[channel.messages.length - 1];
          return (
            <Flex
              backgroundColor={"white"}
              borderWidth="1px"
              borderColor={borderColor}
              m={2}
              borderRadius={"1xl"}
              key={name}
            >
              <Box
                display="flex"
                width="full"
                padding={2}
                boxShadow={
                  curChannel === name &&
                  `inset 0 0 3px 0 ${theme.colors.blue[500]}`
                }
              >
                <Stack isInline={true} spacing={4}>
                  <Stack justify="space-between">
                    <Heading
                      size="xs"
                      color="gray.500"
                      textTransform="uppercase"
                      fontWeight="semibold"
                      onClick={() => selectChannel(name)}
                      cursor={"pointer"}
                    >
                      {name}
                    </Heading>

                    <Text fontSize="sm" maxWidth="4xl" color="gray.500">
                      {lastMessage ? (
                        <>
                          {lastMessage.user} :{" "}
                          {moment(lastMessage.sent).fromNow(true)} ago
                        </>
                      ) : (
                        "N/A"
                      )}
                    </Text>
                  </Stack>
                </Stack>
                <Stack
                  justify="space-between"
                  align="flex-end"
                  marginLeft="auto"
                  paddingLeft={4}
                >
                  <CloseIcon
                    cursor={"pointer"}
                    onClick={() => removeChannel(name)}
                  />
                </Stack>
              </Box>
            </Flex>
          );
        })
      )}
    </Box>
  );
}
