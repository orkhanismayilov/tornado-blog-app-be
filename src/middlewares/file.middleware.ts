import { getDateForFileName } from '@tba/utils';

import multer from 'multer';
import path from 'path';

const MIME_TYPE_MAP = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/svg+xml', 'svg'],
]);

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    const isValid = MIME_TYPE_MAP.has(file.mimetype);
    const error = !isValid ? new Error('Invalid file type! Only png, jpg, jpeg, webp, svg is allowed.') : null;

    callback(error, path.join(__dirname, '../../../public/images'));
  },
  filename: (_req, file, callback) => {
    const name = file.originalname.toLowerCase().replace(/[^\w]+/gi, '-');
    const ext = MIME_TYPE_MAP.get(file.mimetype);

    callback(null, `${name}-${getDateForFileName()}.${ext}`);
  },
});

export const getFile = (filePath: string) => multer({ storage }).single(filePath);
