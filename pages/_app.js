import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import App from 'next/app';
import Pusher from 'pusher-js';
import { ChatContext } from '../lib/chat-context';
import styles from 'spectre.css/dist/spectre.min.css';
import icons from 'spectre.css/dist/spectre-icons.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let pusher;

if (typeof window !== 'undefined') {

  if (process.env.NODE_ENV !== 'production') {
    // Enable pusher logging - isn't included in production
    Pusher.logToConsole = true;
  }

  pusher = new Pusher('c753a8be046a908376fc', {
    cluster: 'ap2',
    forceTLS: true,
    authEndpoint: '/api/auth',
  });
}

export default class MyApp extends App {
  constructor() {
    super();

    // Expose MyApp's state as context for simplicity (sub-optimal)
    this.state = {
      user: null,
      channels: {},
      channelNames: [],
      curChannel: null,
      updateCtx: (newValues = {}) => {
        this.setState({
          ...this.state,
          ...newValues,
        });
      },
      resetCtx: () => {
        for (const name of this.state.channelNames) {
          const channel = this.state.channels[name];
          channel.sub.unbind('client-message');
          pusher.unsubscribe(name);
        }

        this.setState({
          ...this.state,
          user: null,
          channels: {},
          channelNames: [],
          curChannel: null,
        });
      },
      removeChannel: (name) => {
        const newChannels = { ...this.state.channels };
        const newChannelNames = this.state.channelNames.filter(
          (n) => n !== name
        );
        const channel = newChannels[name];

        channel.sub.unbind('client-message');
        pusher.unsubscribe(name);
        delete newChannels[name];

        let curChannel = this.state.curChannel;
        if (curChannel === name) curChannel = newChannelNames[0];
        this.state.updateCtx({
          curChannel,
          channels: newChannels,
          channelNames: newChannelNames,
        });
      },
      joinChannel: (name) => {
        const sub = pusher.subscribe(`private-${name}`);
        sub.bind('client-message', (data) => this.handleMessage(name, data));

        this.state.updateCtx({
          curChannel: name,
          channels: {
            ...this.state.channels,
            [name]: {
              messages: [],
              sub,
            },
          },
          channelNames: [...this.state.channelNames, name],
        });
      },
      sendMessage: (text) => {
        const { channels, curChannel } = this.state;
        const channel = channels[curChannel];
        if (!channel) return;
        const message = {
          text,
          user: this.state.user,
          sent: new Date().getTime(),
        };
        channel.messages.push(message);
        channel.sub.trigger('client-message', message);
        this.setState({ channels });
      },
    };
  }

  handleMessage(channelName, message) {
    const channel = this.state.channels[channelName];
    channel.messages.push(message);

    this.setState({
      ...this.state,
    });
  }

  render() {
    const {
      Component,
      pageProps: { session, ...pageProps },
    } = this.props;

    return (
      <>
        <SessionProvider session={session}>
          <ChakraProvider>
            <ChatContext.Provider value={this.state}>
              <Component {...pageProps} />
            </ChatContext.Provider>
          </ChakraProvider>
        </SessionProvider>
        <ToastContainer />
      </>
    );
  }
}
