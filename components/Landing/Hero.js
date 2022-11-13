import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function CallToActionWithAnnotation() {
  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Bring your students <br />
            <Text
              bgGradient="linear(to-r, pink.400, blue.600)"
              bgClip="text"
              as={'span'}
            >
              closer than before
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            WebClass is a platform that allows you to connect with your students
            and share your insights with them. Manage assignments, attendance
            and grades all in one place.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Link href="/auth/sign-in">
              <Button
                bgGradient={'linear(to-r, pink.500, blue.700)'}
                rounded={'full'}
                px={6}
                transition={'all 0.2s ease-in-out'}
                transitionDuration={'1000ms'}
                color={'white'}
                _hover={{
                  bgGradient: 'linear(to-r, pink.700, blue.500)',
                  transition: 'all 0.2s ease-out',
                  transitionDuration: '1000ms',
                }}
              >
                Sign Up with GitHub
              </Button>
            </Link>
            <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
