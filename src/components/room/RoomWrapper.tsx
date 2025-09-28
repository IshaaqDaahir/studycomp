'use client';

import { ChannelProvider } from 'ably/react';

interface RoomWrapperProps {
  roomId: string | number;
  children: React.ReactNode;
}

export default function RoomWrapper({ roomId, children }: RoomWrapperProps) {
  return (
    <ChannelProvider channelName={`room-${roomId}`}>
      {children}
    </ChannelProvider>
  );
}