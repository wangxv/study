import { pathExistsSync } from 'path-exists';

export function exists (path) {
  console.log('hello utils');
  return pathExistsSync(path);
};
