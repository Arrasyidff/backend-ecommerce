import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import routes from './routes';
// import { AuthMiddleware } from './api/auth/auth.middleware';
import { serverAdapter } from './utils/admin';

class App {
  public app: Application;
  
  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeBullBoard();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }
  
  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(loggerMiddleware);
  }

  private initializeBullBoard(): void {
    // const authMiddleware = new AuthMiddleware();
    // Route untuk Bull Board UI, hanya bisa diakses oleh admin
    this.app.use(
      '/admin/queues',
      // authMiddleware.authenticate,
      // authMiddleware.authorize(['ADMIN']),
      serverAdapter.getRouter()
    );
  }
  
  private initializeRoutes(): void {
    this.app.use('/api', routes);
  }
  
  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
