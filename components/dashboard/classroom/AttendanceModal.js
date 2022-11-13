import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

function AttendanceModal({ isOpen, onClose, studentIds, classroomId }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [checked, setChecked] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  async function onSubmitHandler(e) {
    e.preventDefault();

    const attendanceData = studentIds
      .filter((studentId) => checked.includes(studentId.id))
      .map((studentId) => ({
        userId: studentId.id,
        date: new Date().getTime(),
      }));

    setIsLoading(true);

    try {
      const res = await fetch('/api/db/check-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId,
          attendanceData,
        }),
      });

      const json = await res.json();
      console.log(json);

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
        <ModalHeader>
          Attendance for {new Date().toLocaleDateString()}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} my={4}>
          <form onSubmit={onSubmitHandler}>
            {studentIds.map((student) => (
              <HStack my={2} key={student._id} justify="space-between">
                <Text fontSize={'lg'}>{student.name}</Text>
                <CheckboxGroup>
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked([...checked, student.id]);
                      } else {
                        setChecked(checked.filter((id) => id !== student.id));
                      }
                    }}
                    isChecked={checked.includes(student.id)}
                  >
                    Present
                  </Checkbox>
                </CheckboxGroup>
              </HStack>
            ))}
            <Button isLoading={isLoading} type="submit">
              Submit
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AttendanceModal;
