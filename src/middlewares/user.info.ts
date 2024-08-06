import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { UserCache, UserContextState } from "../caches/user.cache";
import { LoginService } from "../services/login.service";

declare module 'koa' {
  interface BaseContext {
    user: UserContextState,
  }
}

@Middleware.Injectable
export class AuthorizeWare extends Middleware {
  @Middleware.Inject(UserCache)
  private readonly user: UserCache;

  @Middleware.Inject(LoginService)
  private readonly login: LoginService;

  public async use(ctx: Context, next: Next) {
    let token = ctx.cookies.get('authorization', { signed: true });
    if (!token) token = ctx.get('authorization');
    if (!token) return await next();

    const { has, read } = this.login.useToken(token);

    if (!(await has())) return await next();

    const id = await read();
    if (id) {
      const user = await this.user.$read({ id: id.toString() });
      ctx.user = user;
    }

    await next();
  }
}