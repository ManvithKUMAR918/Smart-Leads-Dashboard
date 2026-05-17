import app from './app';
import connectDB from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║       Smart Leads API Server                     ║
║──────────────────────────────────────────────────║
║  🚀 Server:  http://localhost:${env.PORT}             ║
║  📊 Health:  http://localhost:${env.PORT}/api/health   ║
║  🌍 Env:     ${env.NODE_ENV.padEnd(35)}║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

startServer();
