import { useContext } from "react";
import { ChatContext } from "../../lib/chat-context";
import moment from "moment";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import {
  Input,
  Button,
  HStack,
  Box,
  Heading,
  Alert,
  AlertTitle,
  AlertIcon,
  Stack,
  theme,
  VStack,
} from "@chakra-ui/react";
var Sentiment = require("sentiment");
var sentiment = new Sentiment();
const maxLength = 256;
const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

export default function Chat() {
  const { user, sendMessage, channels, curChannel } = useContext(ChatContext);
  const channel = channels[curChannel] || [];
  const me = user;
  console.log(user);
  const checkSendMessage = () => {
    const el = document.querySelector("#new-message");
    const val = (el.value || "").trim();
    if (!val || val.length > maxLength) return;
    el.value = "";
    sendMessage(val);
  };

  return (
    <>
      <Box p={2} overflow="hidden" overflowY="scroll" height={"calc(80vh)"}>
        {!channel.messages ||
          (channel.messages.length === 0 && (
            <Alert status="warning">
              <AlertIcon />
              No messages yet...
            </Alert>
          ))}
        {channel.messages &&
          channel.messages.map(({ text, user, sent }) => {
            const s = sentiment.analyze(text).score;
            const mood =
              s > 0 ? HAPPY_EMOJI : s == 0 ? NEUTRAL_EMOJI : SAD_EMOJI;
            if (me === user)
              return (
                <Flex key={sent} w="100%" justify="flex-end">
                  <Flex
                    color="black"
                    minW="100px"
                    maxW="full"
                    direction="column"
                  >
                    <Text
                      w="fit-content"
                      p={2}
                      rounded="md"
                      m={2}
                      mb={0}
                      minW="71px"
                      maxW="100%"
                      wordBreak="break-word"
                      bg={"gray.200"}
                    >
                      {" "}
                      {text}
                    </Text>
                    <Text
                      as="span"
                      m={2}
                      mb={0}
                      color={"black"}
                      fontSize="12px"
                    >
                      {moment(sent).format("LT")}
                      <span>{String.fromCodePoint(...mood)}</span>
                    </Text>
                  </Flex>
                </Flex>
              );
            else
              return (
                <Flex key={sent} w="100%">
                  <VStack>
                    <Avatar bg="blue.300" size="md" />
                    <Text as="b" fontSize="12px">
                      {" "}
                      {user}
                    </Text>
                  </VStack>
                  <Flex
                    color="black"
                    minW="100px"
                    maxW="full"
                    my="1"
                    direction="column"
                  >
                    <Text
                      w="fit-content"
                      p={2}
                      rounded="md"
                      m={2}
                      mb={0}
                      minW="71px"
                      maxW="100%"
                      wordBreak="break-word"
                      bg={"gray.200"}
                    >
                      {" "}
                      {text}
                    </Text>
                    <Text
                      as="span"
                      m={2}
                      mb={0}
                      color={"black"}
                      fontSize="12px"
                    >
                      {moment(sent).format("LT")}
                      <span>{String.fromCodePoint(...mood)}</span>
                    </Text>
                  </Flex>
                </Flex>
              );
          })}
        
      </Box>
      <HStack p={4} m={2}>
          <Input
            id="new-message"
            maxLength={maxLength}
            placeholder="Type here"
          />
          <Button m={2} colorScheme="blue" onClick={checkSendMessage}>
            Send
          </Button>
        </HStack>
      <style jsx>{`
        .messages {
          overflow-y: scroll;
          overflow-x: hidden;
          height: calc(100vh - 40px - 82px);
        }

        .no-messages {
          font-weight: 600;
          padding: 10px;
        }

        .message {
          padding: 5px 8px;
          border-bottom: 1px solid #3b4351;
        }

        .message .info span:nth-child(1) {
          font-weight: 600;
        }

        .message .content {
          word-wrap: break-word;
        }

        .new-message {
          display: flex;
          align-items: center;
          flex-direction: row;
        }
        .new-message textarea {
          resize: none;
        }
        .new-message button {
          margin: 0 5px;
        }
      `}</style>
    </>
  );
}
