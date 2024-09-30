import { Socket, Server } from 'socket.io';
import { handleNewBid } from './bidding';
import { IBidInfo } from 'interfaces/BidInfo';

export const handleSocketEvents = (socket: Socket, io: Server) => {
  socket.on('join auction room', (data: { room: string }) => {
    socket.join(data.room);
    console.log(`Client ${socket.id} joined room: ${data.room}`);
  });

  socket.on('leave auction room', (data: { room: string }) => {
    socket.leave(data.room);
    console.log(`Client ${socket.id} left room: ${data.room}`);
  });

  socket.on('new bid', (data: { bidInfo: IBidInfo; room: string }) => {
    handleNewBid(io, data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
};
