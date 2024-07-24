import t, { JSONSchemaObject } from '@braken/json-schema';
import Logger from '@braken/logger';
import { Middleware } from "@braken/http";
import { Context, Next } from "koa";

@Middleware.Injectable
export class JSONErrorCatch extends Middleware {
  @Middleware.Inject(Logger)
  private readonly logger: Logger;
  public async use(ctx: Context, next: Next) {
    try {
      await next();
      ctx.body = {
        status: 200,
        data: ctx.body,
      }
    } catch (e) {
      this.logger.error(e.stack);
      ctx.body = {
        status: e.status || ctx.status || 500,
        message: e.message,
      }
    }
  }

  static Wrap(value: JSONSchemaObject) {
    return t.Object({
      status: t.Number(200).required(),
      data: value,
      message: t.String('error message'),
    })
  }
}

@Middleware.Injectable
export class PlainErrorCatch extends Middleware {
  @Middleware.Inject(Logger)
  private readonly logger: Logger;
  public async use(ctx: Context, next: Next) {
    try {
      await next();
    } catch (e) {
      this.logger.error(e.stack);
      ctx.status = e.status || ctx.status || 500;
      ctx.body = e.message;
    }
  }
}