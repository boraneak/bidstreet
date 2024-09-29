import { Server } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { handleSocketEvents } from './events';

export const initializeSocket = (server: Server) => {
  const io = new SocketIOServer(server);

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    handleSocketEvents(socket, io);
  });
  return io;
};
