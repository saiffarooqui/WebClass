import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  VStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';

const IMAGE =
  'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

export default function GitCards({ data }) {
  console.log(data);
  return (
    <>
      <Center py={12}>
        <VStack spacing="10px">
          <Heading fontSize={'4xl'} mb={'2'}>
            Github Repositories
          </Heading>
          <Accordion allowToggle w={'800px'}>
            {data.items.map((item) => {
              return (
                <>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {item.full_name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack>
                        <Text fontSize="sm">{item.description}</Text>
                        <a href={item.clone_url}>
                          <Button
                            colorScheme="purple"
                            ml={'4'}
                            mb={'4'}
                            w={'100px'}
                          >
                            Visit
                          </Button>
                        </a>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </>
              );
            })}
          </Accordion>
        </VStack>
      </Center>
    </>
  );
}
