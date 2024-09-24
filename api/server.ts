import { connectToDatabase } from './database';
import { createServer } from 'http';
import app from 'src/app';
import { config } from 'config/config';
import { initializeSocket } from 'src/scoket';

const server = createServer(app);

app.listen(config.port, async () => {
  const currentDate = new Date().toLocaleString();
  console.log('Server Info:');
  console.log(`Environment: ${config.nodeEnv}`);
  await connectToDatabase();
  const io = initializeSocket(server);
  console.log(
    'Socket.IO server initialized and listening for connections.',
    io,
  );
  console.log(
    `Server is listening at http://localhost:${config.port} on ${currentDate}`,
  );
});
