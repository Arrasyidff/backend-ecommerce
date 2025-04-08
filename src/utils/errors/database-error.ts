import { ApiError } from './api-error';

export class DatabaseError extends ApiError {
  constructor(message: string = 'Database operation failed') {
    super(500, message);
  }
}