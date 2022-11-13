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
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AISupport from './AISupport';

function NewClassRoomModal({ isOpen, onClose, classroomId }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalScore: 0,
  });

  async function submitHandler() {
    setIsLoading(true);

    try {
      const res = await fetch('/api/db/new-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          dueDate: new Date(data.dueDate).getTime(),
          classroomId: classroomId,
          totalScore: +data.totalScore,
        }),
      });

      const result = await res.json();
      console.log(result);

      setIsLoading(false);

      router.replace(router.asPath);
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
      <ModalContent>
        <ModalHeader>Create assignment</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Text>Assignment Title</Text>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              ref={initialRef}
              placeholder="Assignment 1!!"
            />
          </FormControl>

          <FormControl mt={4}>
            <Text>Description/Brief overview</Text>
              <Textarea
              placeholder="Add text..."
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={3}
              shadow="sm"
              focusBorderColor="brand.400"
              fontSize={{
                sm: 'sm',
              }}
          
            />
          </FormControl>

          <FormControl mt={4}>
            <Text>Due date</Text>
            <Input
              value={data.dueDate}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setData({ ...data, dueDate: e.target.value })}
            />
          </FormControl>

          <FormControl mt={4}>
            <Text>Total score</Text>
            <Input
              placeholder="50?"
              value={data.totalScore}
              type="number"
              onChange={(e) => setData({ ...data, totalScore: e.target.value })}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <AISupport role={"mentor"}/>
          <Button
            isLoading={isLoading}
            onClick={submitHandler}
            colorScheme="blue"
            mr={3}
          >
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewClassRoomModal;
