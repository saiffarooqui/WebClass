import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  CloseButton,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
export default function Custom(props) {
  const [deleted,setDel] = useState(false)
  const { detailPage, message, receivedTime, image } = props.data;
  async function onClose() {
    try {
      const res = await fetch("/api/db/changeNotice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: image,
        }),
      });
      //console.log("Deleted")
      setDel(true)
    } catch (error) {
      console.log(error);
    }
    setDel(true)
  }
  return (
    <>
      <HStack>
        <Alert status="info" maxW={"97%"} m={"2"}>
          <AlertIcon />
          <Box>
            <Text as={deleted?'s':''} fontSize="xs">{message}</Text>
            <HStack align={"left"} justify={"space-between"}>
              <Text as="b">{detailPage}</Text>
              <Text>{receivedTime}</Text>
            </HStack>
          </Box>
        </Alert>
        {image !== "" && <CloseButton onClick={onClose} />}
      </HStack>
    </>
  );
}
