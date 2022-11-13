import {
  Button,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState();

  async function submitHandler(data) {
    setIsLoading(true);
    let image = session.user.image;

    try {
      const res = await fetch('/api/db/newuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email || session.user.email,
          role: router.query.role || 'student',
          [router.query.role === 'mentor' ? 'designation' : 'department']:
            data.designation || data.department,
          image: image,
        }),
      });

      const result = await res.json();
      console.log(result);

      setIsLoading(false);

      reset();

      router.replace('/dashboard');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <VStack marginY={'60px'}>
      <Text fontSize={'md'} fontWeight={'medium'}>
        New User? Sign-In to get started
      </Text>

      <Stack>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack>
            {errors.name ? (
              <Text color="red.200">{errors.name.message}</Text>
            ) : (
              <Text opacity={0.5}>Name</Text>
            )}
            <Input
              width="20rem"
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
            />

            {router.query.role === 'mentor' ? (
              <>
                {errors.designation ? (
                  <Text color="red.200">{errors.designation.message}</Text>
                ) : (
                  <Text opacity={0.5}>Designation</Text>
                )}
                <Input
                  width="20rem"
                  placeholder="Assistant Professor"
                  {...register('designation', {
                    required: 'Designation required',
                  })}
                />
              </>
            ) : (
              <>
                {errors.department ? (
                  <Text color="red.200">{errors.department.message}</Text>
                ) : (
                  <Text opacity={0.5}>Department</Text>
                )}
                <Input
                  width="20rem"
                  placeholder="Computer Department"
                  {...register('department', {
                    required: 'Designation required',
                  })}
                />
              </>
            )}
            <Text opacity={0.5}>Email</Text>

            <Input
              disabled
              value={session?.user.email}
              width="20rem"
              placeholder={session?.user.email || 'johndoe@gmail.com'}
              {...register('email')}
            />

            <Button
              isLoading={isLoading}
              variant="solid"
              colorScheme={'purple'}
              type="submit"
            >
              Register
            </Button>
          </Stack>
        </form>

        <Link
          href={`/dashboard/new-user?role=${
            router.query.role === 'mentor' ? 'student' : 'mentor'
          }`}
          fontSize={'md'}
          fontWeight={'medium'}
        >
          {router.query.role === 'mentor'
            ? 'Student? Click here'
            : 'Mentor? Click here'}
        </Link>
      </Stack>
    </VStack>
  );
}

export default Form;
