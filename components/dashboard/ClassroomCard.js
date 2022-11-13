import {
  Heading,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function ClassroomCard({ title, noOfStudents, id }) {
  return (
    <Box py={6}>
      <Box
        w={'330px'}
        h={'220px'}
        bg={useColorModeValue('white', 'gray.900')}
        rounded={'lg'}
        borderWidth={'2px'}
        p={6}
        textAlign={'left'}
      >
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {title}
        </Heading>

        <Text>
          {noOfStudents} student{noOfStudents > 1 ? 's' : ''} enrolled
        </Text>

        <Stack mt={8} direction={'row'} spacing={4}>
          <Link href={`/dashboard/classroom/${id}`}>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              size='sm'
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}
            >
              Open
            </Button>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
