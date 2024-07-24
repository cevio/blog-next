import { HttpProps } from '@braken/http';

export interface BlogProps {
  cache: {
    type: 'file' | 'redis',
    directory?: string,
  }
  database: BlogDataBaseProps,
  redis?: BlogRedisProps,
  http: HttpProps,
}

export interface BlogDataBaseProps {
  type: 'mssql' | 'mysql' | 'oracle' | 'postgres',
  host: string,
  port: number,
  username?: string,
  password?: string,
  database: string,
  entityPrefix?: string,
}

export interface BlogRedisProps {
  host: string,
  port: number,
  password?: string,
  db?: number,
}

export type NestedKeys<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
  ? `${K}` | `${K}.${NestedKeys<T[K]>}`
  : `${K}`;
}[keyof T & (string | number)];