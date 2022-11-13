import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function JoinModal({ isOpen, onClose, role, id }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  function generate5DigitCode() {
    return Math.floor(10000 + Math.random() * 90000);
  }

  const [data, setData] = useState(
    role === 'mentor'
      ? {
          code: '',
          name: '',
          startDate: '',
          endDate: '',
        }
      : {
          code: '',
        }
  );

  async function createClassRoomHandler() {
    setIsLoading(true);

    let res;

    try {
      if (role === 'mentor') {
        res = await fetch('/api/db/new-classroom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: generate5DigitCode(),
            name: data.name,
            startDate: new Date(data.startDate).getTime(),
            endDate: new Date(data.endDate).getTime(),
            mentor: session.user.name,
            mentorId: id,
            image: session.user.image,
            email: session.user.email,
          }),
        });
      } else if (role === 'student') {
        res = await fetch('/api/db/join-classroom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: data.code,
            studentName: session.user.name,
            studentId: id,
            image: session.user.image,
            studentEmail: session.user.email,
          }),
        });
      }

      const result = await res.json();
      console.log(result);

      if (result.message === 'Student already exists') {
        alert('You are already a part of the classroom');
        setIsLoading(false);
        return;
      }

      if (result.message === 'Classroom not found') {
        alert('Classroom not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

      router.replace(`/dashboard`);

      onClose();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      {role === 'student' ? (
        <ModalContent>
          <ModalHeader>Join Classroom</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Code</FormLabel>
              <Input
                ref={initialRef}
                value={data.code}
                onChange={(e) => setData({ ...data, code: e.target.value })}
                placeholder="5 character code"
              />
            </FormControl>

            <Text>
              If you don&apos;t have a code, ask your teacher for one.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={createClassRoomHandler} colorScheme="blue" mr={3}>
              Join
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader>Create Classroom</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Classroom title</FormLabel>
              <Input
                value={data.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                  })
                }
                ref={initialRef}
                placeholder="Quantum Physics 101"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Semester Start Date</FormLabel>
              <Input
                type={'date'}
                value={data.startDate}
                onChange={(e) =>
                  setData({
                    ...data,
                    startDate: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Semester End Date</FormLabel>
              <Input
                type={'date'}
                value={data.endDate}
                onChange={(e) =>
                  setData({
                    ...data,
                    endDate: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={createClassRoomHandler}
              isLoading={isLoading}
              colorScheme="blue"
              mr={3}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}

export default JoinModal;
