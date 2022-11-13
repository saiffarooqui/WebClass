import { Button, Stack, Text, VStack } from '@chakra-ui/react';
import { getSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { SiGithub } from 'react-icons/si';

function SignInPage() {
  return (
    <VStack
      align="center"
      justify="center"
      bgGradient={
        'linear-gradient(to right top, #bcd3f5, #a6b4e5, #9b93d0, #9770b5, #954a93)'
      }
      __css={{
        height: '100vh',
      }}
    >
      <Head>
        <title>WebClass : Sign In</title>
      </Head>
      <Stack
        rounded={'2xl'}
        shadow={'xl'}
        width="20%"
        height="auto"
        padding="20px"
        gap={5}
        bgColor={'aqua'}
      >
        <Text fontSize={'xl'} textAlign="center">
          Sign in to your account
        </Text>

        <Text textAlign="center">
          <b>WebClass</b> never posts on your behalf. We never share your
          personal information with anyone.
        </Text>

        <Button
          rightIcon={<SiGithub size={'20px'} />}
          variant={'ghost'}
          bgColor={'white'}
          onClick={() => signIn('github')}
        >
          Sign In
        </Button>
      </Stack>
    </VStack>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default SignInPage;
