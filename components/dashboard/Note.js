import React from "react";
import { chakra, HStack, VStack, Text, Image } from "@chakra-ui/react";
import moment from "moment";
function Note({ title, content, serial, date }) {
  const toggleOpen = () => setIsOpen(!isOpen);
  const [isOpen, setIsOpen] = React.useState(false);
  const textColor = "gray.500";
  return (
    <chakra.div onClick={toggleOpen} key={content} w={"800px"}>
      <HStack
        p={4}
        bg={"white"}
        rounded="xl"
        borderWidth="1px"
        borderColor={"gray.100"}
        w="100%"
        h="100%"
        textAlign="left"
        align="start"
        spacing={4}
        cursor="pointer"
        _hover={{ shadow: "lg" }}
      >
        <Image
          src={"https://via.placeholder.com/150"}
          size="sm"
          width={33}
          height={33}
          layout="fixed"
          rounded="md"
          objectFit="cover"
          alt="cover image"
          fallbackSrc="https://via.placeholder.com/150"
        />
        <VStack align="start" justify="flex-start">
          <VStack spacing={0} align="start">
            <HStack>
              <Text
                fontWeight="bold"
                fontSize="md"
                noOfLines={1}
                onClick={(e) => e.stopPropagation()}
                isExternal
              >
                {title}
              </Text>
            </HStack>

            {!isOpen && (
              <Text fontSize="sm" color={textColor} noOfLines={{ base: 2 }}>
                {content}
              </Text>
            )}

            {isOpen && (
              <Text fontSize="sm" color={textColor}>
                {content}
              </Text>
            )}
          </VStack>
        </VStack>
        <Text fontSize="sm" color={textColor}>
          {moment(date).fromNow(true)}
        </Text>
      </HStack>
    </chakra.div>
  );
}

export default Note;
