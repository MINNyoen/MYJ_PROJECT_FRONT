import { useRef, useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider } from '@mui/material';
import { addMessage } from 'slices/chat';
import { useDispatch } from 'store';
import type { Contact } from 'types/chat';
import { ChatComposerToolbar } from './chat-composer-toolbar';
import { ChatMessageAdd } from './chat-message-add';
import path from 'components/path.json';
import { useAuth } from 'hooks/use-auth';
import { chatApi } from 'api/chat-api';

interface ChatComposerProps {}

export const ChatComposer: FC<ChatComposerProps> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [recipients, setRecipients] = useState<Contact[]>([]);
  const { user } = useAuth();

  const handleAddRecipient = (recipient: Contact): void => {
    setRecipients((prevState) => {
      const exists = prevState.find((_recipient) => _recipient.userSid === recipient.userSid);

      if (!exists) {
        return [...recipients, recipient];
      }

      return recipients;
    });
  };

  const handleRemoveRecipient = (recipientId: string): void => {
    setRecipients((prevState) => prevState.filter(
      (recipient) => recipient.userSid !== recipientId)
    );
  };

  const handleSendMessage = async (body: string): Promise<void> => {
    try {
      if(user && user?.userSid) {
        const recipientIds:string[] = [];
        recipientIds.push(user?.userSid.toString());

        recipients.map((n)=> user?.userSid && n.userSid.toString() !== user?.userSid.toString() && recipientIds.push(n.userSid));

        const roomId = await chatApi.getChatThreadByParticipants(recipientIds);
        // Handle send message and redirect to the new thread

        await dispatch(addMessage({
          roomId: roomId.toString(),
          recipientIds: recipientIds,
          body,
          user
        }));

        router.push(path.pages.minyeonjin.community.chatting+`?threadKey=${roomId}`).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
      {...props}
    >
      <ChatComposerToolbar
        onAddRecipient={handleAddRecipient}
        onRemoveRecipient={handleRemoveRecipient}
        recipients={recipients}
      />
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      />
      <Divider />
      <ChatMessageAdd
        disabled={recipients.length === 0}
        onSend={handleSendMessage}
      />
    </Box>
  );
};
