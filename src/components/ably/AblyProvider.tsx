'use client';

import { AblyProvider } from 'ably/react';
import { Realtime } from 'ably';

const client = new Realtime({ 
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
  clientId: 'study-companion-user'
});

export default function AblyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AblyProvider client={client}>
      {children}
    </AblyProvider>
  );
}