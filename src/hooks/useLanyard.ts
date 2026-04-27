import { useEffect, useState } from 'react';

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    global_name: string | null;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    type: number;
    name: string;
    details?: string;
    state?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
    };
  }>;
  listening_to_spotify: boolean;
  spotify: {
    song: string;
    artist: string;
    album_art_url: string;
  } | null;
}

export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await response.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error('Lanyard fetch error:', err);
      }
    };

    fetchStatus();

    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: any;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.op === 1) {
        socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        heartbeatInterval = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }));
        }, message.d.heartbeat_interval);
      }

      if (message.op === 0) {
        setData(message.d);
      }
    };

    return () => {
      clearInterval(heartbeatInterval);
      socket.close();
    };
  }, [userId]);

  return data;
}
