import { ApiError } from './api-error';

export class AuthError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}