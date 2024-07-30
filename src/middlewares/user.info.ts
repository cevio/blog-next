import CacheServer from "@braken/cache";
import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { UserContextState } from "../caches/user.cache";

declare module 'koa' {
  interface BaseContext {
    user: UserContextState,
  }
}

@Middleware.Injectable
export class AuthorizeWare extends Middleware {
  @Middleware.Inject(CacheServer)
  private readonly cache: CacheServer;

  public async use(ctx: Context, next: Next) {
    let token = ctx.cookies.get('authorization', { signed: true });
    if (!token) token = ctx.get('authorization');
    if (!token) return await next();

    const userTokenCacheKey = '/login/token/' + token;
    ctx.user = await this.cache.read(userTokenCacheKey);

    await next();
  }
}