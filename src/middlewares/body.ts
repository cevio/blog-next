import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { koaBody } from 'koa-body';
import { SystemVariable } from "../variables/system.var";

@Middleware.Injectable
export class HttpBodyMiddleware extends Middleware {
  @Middleware.Inject(SystemVariable)
  private readonly system: SystemVariable;
  public async use(ctx: Context, next: Next) {
    await koaBody({
      jsonStrict: false,
      jsonLimit: this.system.get('requestBodyJSONLimit') + 'mb',
      formLimit: this.system.get('requestBodyFORMLimit') + 'mb',
      textLimit: this.system.get('requestBodyTextLimit') + 'mb',
      multipart: true,
    })(ctx, next);
  }
}