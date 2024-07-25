import { Middleware } from "@braken/http";
import { Context, Next } from "koa";
import { SystemVariable } from '../variables/system.var';
import { Language } from '../apps/language.app';
import { Exception } from '../exception';

@Middleware.Injectable
export class SwaggerUseable extends Middleware {
  @Middleware.Inject(SystemVariable)
  private readonly system: SystemVariable;

  @Middleware.Inject(Language)
  private readonly lang: Language;

  public async use(ctx: Context, next: Next) {
    if (!this.system.get('swagger')) {
      throw new Exception(502, this.lang.get('swagger.unsupport'));
    }
    await next();
  }
}