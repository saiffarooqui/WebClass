import {  useContext, } from 'react';
import { ChatContext } from '../lib/chat-context';
import UserModal from '../components/chat/user-modal';
import Channels from '../components/chat/channel';
import Chat from '../components/chat/chat';
import { Grid, GridItem } from '@chakra-ui/react'
const ExtLink = ({ children, ...props }) => (
  <a rel="noreferrer noopener" target="_blank" {...props}>
    {children}
  </a>
);

export default function Index() {
  const { user } = useContext(ChatContext);
  return (
    <>
      {!user && <UserModal />}
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
      <GridItem  colSpan={1} >
      <Channels />
        </GridItem>
        <GridItem colSpan={2}>
        <Chat />
        </GridItem>
      </Grid>
      

      <style jsx>{`
        h2 {
          text-align: center;
        }

        h2 i {
          font-size: 24px;
          margin-left: 10px;
        }

        hr {
          margin-bottom: 0;
        }

        .channels,
        .chat {
          height: calc(100vh - 40px);
          overflow-x: hidden;
          overflow-y: scroll;
        }

        .channels {
          border-right: 1px solid #3b4351;
        }
      `}</style>
    </>
  );
}
