import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.join('./src/.env') });
if (result.error) {
  throw result.error;
}

export const { MONGO_DB_CONNECTION_STRING, JWT_SECRET_KEY, HOST } = result.parsed;
