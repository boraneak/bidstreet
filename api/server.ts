import { connectToDatabase } from './database';
import { createServer } from 'http';
import app from 'src/app';
import { config } from 'config/index';
import { initializeSocket } from 'src/socket';

const server = createServer(app);

app.listen(config.port, async () => {
  const currentDate = new Date().toLocaleString();
  console.log('Server Info:');
  console.log(`Environment: ${config.nodeEnv}`);
  await connectToDatabase();
  initializeSocket(server);
  console.log('Socket.IO server initialized and listening for connections.');
  console.log(
    `Server is listening at http://localhost:${config.port} on ${currentDate}`,
  );
});
