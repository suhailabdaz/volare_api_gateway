import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

const setupSocket = async (server: HTTPServer): Promise<SocketIOServer> => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-flight', (flightChartId) => {
      socket.join(flightChartId);
    });
  });
  
  return io;
};

export default setupSocket;
