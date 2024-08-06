import Blog from './index';
import { Plugin } from './apps/plugin.app';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { swagger } from './swagger';
import { Language } from './apps/language.app';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const router = resolve(__dirname, 'plugins');

@Plugin.Injectable
class TestPlugin extends Plugin {
  public readonly name = 'pjblog-plugin-test';
  public readonly version = '1.0.0';
  public readonly description = '测试插件';

  @Plugin.Inject(Language)
  private readonly lang: Language;

  async initialize() {
    await this.loadControllers(router);
    await swagger.autoLoadDefinitons(router);
    await this.lang.load(router);
  }
}

Blog({
  http: {
    port: 3000,
    keys: ['a', 'b']
  },
  cache: {
    type: 'redis',
  },
  database: {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "fdnsyj211314",
    "database": "npm"
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
}, [
  TestPlugin
])