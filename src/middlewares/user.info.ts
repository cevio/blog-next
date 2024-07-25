import CacheServer from "@braken/cache";
import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { BlogUserEntity } from "../entities/user.entity";
import { UserService } from "../services/user.service";

declare module 'koa' {
  interface BaseContext {
    user: BlogUserEntity,
  }
}

@Middleware.Injectable
export class AuthorizeWare extends Middleware {
  @Middleware.Inject(UserService)
  private readonly service: UserService;

  @Middleware.Inject(CacheServer)
  private readonly cache: CacheServer;

  public async use(ctx: Context, next: Next) {
    let token = ctx.cookies.get('authorization', { signed: true });
    if (!token) token = ctx.get('authorization');
    if (!token) return await next();

    const userTokenCacheKey = '/login/token/' + token;
    const account = await this.cache.read(userTokenCacheKey);
    if (account) {
      const user = await this.service.getOneByAccount(account);
      if (user) {
        ctx.user = user;
      }
    }

    await next();
  }
}