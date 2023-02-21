import multer from 'multer';
import path from 'path';

import { IMAGES_DIR } from '../config';

const MIME_TYPE_MAP = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
]);

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    const isValid = MIME_TYPE_MAP.has(file.mimetype);
    const error = !isValid
      ? new Error('Invalid file type! Only png, jpg, jpeg is allowed.')
      : null;
    callback(error, path.join(__dirname, IMAGES_DIR));
  },
  filename: (_req, file, callback) => {
    const name = file.originalname.toLowerCase().replace(/(\s|\/|\\)+/g, '-');
    const ext = MIME_TYPE_MAP.get(file.mimetype);
    callback(null, `${name}-${Date.now()}.${ext}`);
  },
});

export const getFile = (filePath: string) =>
  multer({ storage }).single(filePath);
