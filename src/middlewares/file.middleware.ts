import { MAX_FILE_SIZE, MIME_TYPE_MAP } from '@tba/constants';
import { FileContainer } from '@tba/enums';
import { getDateForFileName } from '@tba/utils';

import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    const error = !MIME_TYPE_MAP.has(file.mimetype)
      ? new Error('Invalid file type! Only png, jpg, jpeg, webp, svg are allowed.')
      : null;

    callback(error, path.join(__dirname, FileContainer.IMAGES));
  },
  filename: (_req, file, callback) => {
    const name = file.originalname.toLowerCase().replace(/[^\w]+/gi, '-');
    const ext = MIME_TYPE_MAP.get(file.mimetype);

    callback(null, `${name}-${getDateForFileName()}-${uuid()}.${ext}`);
  },
});

export const getFile = (filePath: string) =>
  multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE * Math.pow(1024, 2) },
  }).single(filePath);
