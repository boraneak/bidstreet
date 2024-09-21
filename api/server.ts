import { connectToDatabase } from './database';
import app from './src/app';
import { config } from 'config/config';
const PORT = config.port;

app.listen(PORT, async () => {
  const currentDate = new Date().toLocaleString();
  console.log('Server Info:');
  console.log(`Environment: ${config.nodeEnv}`);
  await connectToDatabase();
  console.log(
    `Server is listening at http://localhost:${PORT} on ${currentDate}`,
  );
});
