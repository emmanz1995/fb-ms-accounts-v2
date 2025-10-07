import { createServer } from 'http';
import app from './app';

const server = createServer(app);
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
