import { Box, Button, useDisclosure } from '@chakra-ui/react';
import AttendanceModal from './AttendanceModal';

function Attendance({ studentIds, classroomId }) {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen} size={'sm'}>
        Take attendance for {new Date().toLocaleDateString()}
      </Button>

      <AttendanceModal
        classroomId={classroomId}
        studentIds={studentIds}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}

export default Attendance;
