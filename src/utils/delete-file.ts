import { FileContainer } from '@tba/enums';

import chalk from 'chalk';
import { rm } from 'fs';
import { join } from 'path';

export function deleteFile(path: string, container: FileContainer = FileContainer.IMAGES) {
  rm(join(__dirname, container, path), err => {
    if (err) console.warn(chalk.redBright(`Cannot delete file: ${path}\n${err.message}`));
  });
}
