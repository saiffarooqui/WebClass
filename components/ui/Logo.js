import { HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';

function Logo() {
  return (
    <Link href="/dashboard" >
      <HStack
        textAlign={{ base: 'center', md: 'left' }}
        fontFamily={'heading'}
        color={'gray.800'}
        fontSize={'2xl'}
        fontWeight={'bold'}
        spacing={0}
        cursor='pointer'
      >
        <Text>WEB</Text>

        <Text
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          fontSize="2xl"
          fontWeight="extrabold"
        >
          CLASS
        </Text>
      </HStack>
    </Link>
  );
}

export default Logo;
