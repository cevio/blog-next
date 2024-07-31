import CacheServer from "@braken/cache";
import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { UserCache, UserContextState } from "../caches/user.cache";

declare module 'koa' {
  interface BaseContext {
    user: UserContextState,
  }
}

@Middleware.Injectable
export class AuthorizeWare extends Middleware {
  @Middleware.Inject(CacheServer)
  private readonly cache: CacheServer;

  @Middleware.Inject(UserCache)
  private readonly user: UserCache;

  public async use(ctx: Context, next: Next) {
    let token = ctx.cookies.get('authorization', { signed: true });
    if (!token) token = ctx.get('authorization');
    if (!token) return await next();

    const userTokenCacheKey = '/login/token/' + token;
    const id: number = await this.cache.read(userTokenCacheKey);

    if (id) {
      const user = await this.user.$read({ id: id.toString() });
      ctx.user = user;
    }

    await next();
  }
}