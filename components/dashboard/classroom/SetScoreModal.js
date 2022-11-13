import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { CgAttachment } from 'react-icons/cg';
import React from 'react';

function SetScoreModal({
  isOpen,
  onClose,
  submissions,
  classroomId,
  assignmentId,
  allUsers,
}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const [score, setScore] = React.useState({
    initial: 0,
  });

  async function assignScore(userId, assignmentId) {
    setIsLoading(true);

    try {
      const res = await fetch('/api/db/set-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          assignmentId,
          classroomId,
          score: score[userId],
        }),
      });

      const json = await res.json();
      console.log(json);

      setIsLoading(false);
      router.replace(router.asPath);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  console.log(allUsers);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign scores</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {submissions.map((submission, index) => (
            <HStack gap={3} marginY={3} key={index}>
              <Stack>
                <Text>
                  {allUsers.find((user) => user._id === submission.userId).name}
                </Text>
                <Input
                  disabled={submission.score}
                  value={score[submission.userId]}
                  onChange={(e) =>
                    setScore({ ...score, [submission.userId]: +e.target.value })
                  }
                  placeholder="Score"
                />
              </Stack>

              <HStack>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton size={'xs'} icon={<CgAttachment />} />
                </a>
                <Button
                  disabled={submission.score}
                  onClick={() => assignScore(submission.userId, assignmentId)}
                >
                  Assign
                </Button>
              </HStack>
            </HStack>
          ))}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SetScoreModal;
