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
import { UserVariable } from './variables/user.var';
import { SystemVariable } from './variables/system.var';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __language = resolve(__dirname, 'languages');

export default (props: BlogProps) => BootStrap(async (ctx, logger) => {
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

  // 设置并开启缓存
  Cache.set(CacheAccepts);
  await ctx.use(Cache);
  await ctx.use(UserVariable);

  // 语言包
  const language = await ctx.use(Language);
  const systeVars = await ctx.use(SystemVariable);
  await language.load(__language);
  await language.init(systeVars.get('language'));

  /**
   * 数据库连接模块
   * 改动数据库需要重启服务
   */
  TypeORM.set({
    ...props.database,
    entities: [
      BlogUserEntity,
      BlogCategoryEntity,
      BlogMediaEntity,
      BlogMediaArticleEntity,
      BlogMediaTagEntity,
      BlogAttachmentEntity,
      BlogMediaCommentEntity,
      BlogVisitorEntity,
    ],
    synchronize: true,
    logging: false,
  });
  await ctx.use(TypeORM);

  /**
   * HTTP 服务模块
   * 支持 Controller 模型的路由懒加载
   * 同时支持 swagger 数据 api 管理
   */
  Http.set(props.http);
  const http = await ctx.use(Http);
  http.use(HttpTypeormPlugin);
  // 自动加载 swagger 定义
  await swagger.autoLoadDefinitons(resolve(__dirname, 'definitions'));
  // 加载所有路由
  await http.load(resolve(__dirname, 'controllers'));

  // swagger 缓存数据
  ctx.addCache('swagger:data', swagger.toJSON());
  ctx.addCache('swagger:html', await createSwaggerHtml());

  logger.http('127.0.0.1:' + props.http.port);
})