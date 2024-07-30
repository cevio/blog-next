import './user.info';
import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { Exception } from '../exception';
import { Language } from '../apps/language.app';
import { AuthorizeWare } from './user.info';

@Middleware.Injectable
@Middleware.Dependencies(AuthorizeWare)
export class LoginWare extends Middleware {
  @Middleware.Inject(Language)
  private readonly lang: Language;

  public async use(ctx: Context, next: Next) {
    if (!ctx.user) {
      throw new Exception(401, this.lang.get('user.notlogin'));
    }
    if (ctx.user.forbiden) {
      throw new Exception(403, this.lang.get('user.forbiden'));
    }
    await next();
  }
}

@Middleware.Injectable
@Middleware.Dependencies(LoginWare)
export class AdminWare extends Middleware {
  @Middleware.Inject(Language)
  private readonly lang: Language;

  public async use(ctx: Context, next: Next) {
    if (!ctx.user.admin) {
      throw new Exception(405, this.lang.get('user.notadmin'));
    }
    await next();
  }
}