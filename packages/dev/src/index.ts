import Blog from '@pjblog/blog';
import { TestPlugin } from './plugin';

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