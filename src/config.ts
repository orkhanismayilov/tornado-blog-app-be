import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.join(__dirname, '../src/.env') });
if (result.error) {
  throw result.error;
}

export const { TBA_MONGO_DB_CONNECTION_STRING, TBA_JWT_SECRET_KEY } = result.parsed;
