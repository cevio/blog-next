import BootStrap from '@braken/bootstrap';
import TypeORM from '@braken/typeorm';
import Http from '@braken/http';
import Cache, { CacheProps } from '@braken/cache';
import FileCache from '@braken/cache-file';
import RedisCache from '@braken/cache-ioredis';
import Redis from '@braken/ioredis';
import HttpTypeormPlugin from '@braken/http-plugin-typeorm';

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSwaggerHtml, swagger } from './swagger';
import { BlogProps } from "./types";
import { BlogUserEntity } from './entities/user.entity';
import { BlogCategoryEntity } from './entities/category.entity';
import { BlogMediaEntity } from './entities/media.entity';
import { BlogMediaArticleEntity } from './entities/media.article.entity';
import { BlogMediaTagEntity } from './entities/media.tag.entity';
import { BlogAttachmentEntity } from './entities/attachment.entity';
import { BlogMediaCommentEntity } from './entities/media.comment.entity';
import { BlogVisitorEntity } from './entities/visitor.entity';
import { Language } from './apps/language.app';
import { SystemVariable } from './variables/system.var';
import { Plugin } from './apps/plugin.app';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __languages = resolve(__dirname, 'languages');
const __definitions = resolve(__dirname, 'definitions');
const __controllers = resolve(__dirname, 'controllers');

export const ORMS = new Set([
  BlogUserEntity,
  BlogCategoryEntity,
  BlogMediaEntity,
  BlogMediaArticleEntity,
  BlogMediaTagEntity,
  BlogAttachmentEntity,
  BlogMediaCommentEntity,
  BlogVisitorEntity,
]);

export default (props: BlogProps, plugins: { new(...args: any[]): Plugin }[] = []) => BootStrap(async (ctx, logger) => {
  /**
   * 缓存模块
   * 支持文件缓存和 redis 缓存
   */
  const CacheAccepts: CacheProps[] = [];

  if (props.cache.type === 'file') {
    FileCache.set(props.cache.directory);
    CacheAccepts.push(await ctx.use(FileCache));
  } else if (props.cache.type === 'redis') {
    Redis.set(props.redis);
    RedisCache.prefix(props.http.keys.join(':'));
    await ctx.use(Redis);
    CacheAccepts.push(await ctx.use(RedisCache));
  } else {
    throw new TypeError('Unknow cache type');
  }

  Cache.set(CacheAccepts);

  /**
   * 数据库连接模块
   * 改动数据库需要重启服务
   */
  TypeORM.set({
    ...props.database,
    entities: Array.from(ORMS.values()),
    synchronize: true,
    logging: false,
  });

  /**
   * HTTP 服务模块
   * 支持 Controller 模型的路由懒加载
   */
  Http.set(props.http);
  const http = await ctx.use(Http);
  http.use(HttpTypeormPlugin);

  // 自动加载系统 swagger 定义
  await swagger.autoLoadDefinitons(__definitions);

  // 加载所有系统路由
  await http.load(__controllers);

  // 加载插件
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    await ctx.use(plugin);
  }

  // 语言包
  const language = await ctx.use(Language);
  const systeVars = await ctx.use(SystemVariable);
  const lang = systeVars.get('language'); // 当前使用的语言包名称
  await language.load(__languages);
  await language.init(lang);

  // swagger 缓存数据
  ctx.addCache('swagger:data', swagger.toJSON());
  ctx.addCache('swagger:html', await createSwaggerHtml());

  logger.http('127.0.0.1:' + props.http.port);
})