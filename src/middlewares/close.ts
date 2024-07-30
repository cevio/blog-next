import { Middleware } from "@braken/http";
import { Next, Context } from "koa";
import { SystemVariable } from "../variables/system.var";
import { Exception } from "../exception";

@Middleware.Injectable
export class WebSiteClosedWare extends Middleware {
  @Middleware.Inject(SystemVariable)
  private readonly system: SystemVariable;
  public async use(ctx: Context, next: Next) {
    if (this.system.get('websiteClosed')) {
      throw new Exception(502, this.system.get('websiteClosedReason'));
    }
    await next();
  }
}