import { maxFileSize, mimeTypeMap } from '@tba/constants';
import { getDateForFileName } from '@tba/utils';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    const error = !mimeTypeMap.has(file.mimetype)
      ? new Error('Invalid file type! Only png, jpg, jpeg, webp, svg are allowed.')
      : null;

    callback(error, path.join(__dirname, '../../../public/images'));
  },
  filename: (_req, file, callback) => {
    const name = file.originalname.toLowerCase().replace(/[^\w]+/gi, '-');
    const ext = mimeTypeMap.get(file.mimetype);

    callback(null, `${name}-${getDateForFileName()}.${ext}`);
  },
});

export const getFile = (filePath: string) => multer({ storage, limits: { fileSize: maxFileSize } }).single(filePath);
