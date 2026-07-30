import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export const useSocket = (
  onAllocationUpdated?: (data: any) => void,
  onAllocationRemoved?: (data: any) => void,
  onSiteCreated?: (data: any) => void,
  onWorkerCreated?: (data: any) => void,
  onSiteStatusUpdated?: (data: any) => void,
  onWorkerDragStarted?: (data: any) => void,
  onWorkerDragEnded?: (data: any) => void,
  onSiteUpdated?: (data: any) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(WS_URL, {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('⚡ Connected to real-time dispatch WebSocket server');
    });

    if (onAllocationUpdated) {
      socket.on('allocation_updated', onAllocationUpdated);
    }
    if (onAllocationRemoved) {
      socket.on('allocation_removed', onAllocationRemoved);
    }
    if (onSiteCreated) {
      socket.on('site_created', onSiteCreated);
    }
    if (onWorkerCreated) {
      socket.on('worker_created', onWorkerCreated);
    }
    if (onSiteStatusUpdated) {
      socket.on('site_status_updated', onSiteStatusUpdated);
    }
    if (onWorkerDragStarted) {
      socket.on('worker_drag_started', onWorkerDragStarted);
    }
    if (onWorkerDragEnded) {
      socket.on('worker_drag_ended', onWorkerDragEnded);
    }
    if (onSiteUpdated) {
      socket.on('site_updated', onSiteUpdated);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
};
