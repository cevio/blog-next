import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
export const meta = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
}