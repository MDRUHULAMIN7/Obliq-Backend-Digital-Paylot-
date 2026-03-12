import type { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';
import seedSuperAdmin from './app/DB/index.js';
import connectDB from './app/utils/db.js';

let server: Server;
async function main() {
  try {
    await connectDB();
    await seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('ruhul', error, 'ruhul');
  }
}
main();
process.on('unhandledRejection', () => {
  console.log(`unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(` uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
