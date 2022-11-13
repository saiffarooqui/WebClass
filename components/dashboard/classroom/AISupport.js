import React,{useState} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
    FormLabel,
    Box,
    FormControl,
  GridItem,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input
} from "@chakra-ui/react";
export default function AISupport({role}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const btnRef = React.useRef();
  const [characterInput, setCharacterInput] = useState('');
  const [result, setResult] = useState();
  async function onSubmit(event) {
    event.preventDefault();
    setResult('')
    if(characterInput.trim()==='') return
    const toastId = toast.loading('Loading...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ character: characterInput }),
      });
      const display = await response.json();
      setResult(display.result);
      toast.success('Done', {
        id: toastId,
      });
    }catch (error) {
      console.log(error);
      toast.error('Error occured', {
        id: toastId,
      });
    }finally{
      toast.dismiss(toastId);
    } 
    setCharacterInput('');
  }
  return (
    <div>
      <Button ref={btnRef} colorScheme="teal" mr={3} onClick={onOpen}>
       {role==='mentor'?' AI Help':'Auto Note'}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={role==='mentor'?'sm':'lg'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>AI Guide</DrawerHeader>
          <DrawerBody>
          <Stack
              as={Box}
              textAlign={'left'}
              spacing={{ base: 1, md: 1 }}
              py={{ base: 1, md: 5 }}
            >
              <FormControl as={GridItem} colSpan={6}>
                <FormLabel
                  htmlFor="search"
                  fontSize="lg"
                  fontWeight="md"
                  color="gray.700"
                  _dark={{
                    color: 'gray.50',
                  }}
                >
                  Search
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
              <Button
                m={"2"}
                w="10rem"
                colorScheme="red"
                variant="solid"
                onClick={onSubmit}
              >
                Guide me
              </Button>

              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="s"
                m="2"
                p="4"
                bg="gray.50"
              >
                {result ? result : null}
              </Box>
            </Stack>
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
