import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { JSONErrorCatch } from '../../../middlewares/json';
import { AdminWare } from '../../../middlewares/user.login';
import { ISystemVariable, SystemVariable } from '../../../variables/system.var';
import { HttpBodyWare } from '../../../middlewares/body';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, AdminWare)
@swagger.Controller('系统配置', '获取系统配置', 'configs')
@swagger.ContentType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Object({})))
@swagger.ResponseType('application/json')
class Schema extends Controller {
  @Controller.Inject(SystemVariable)
  private readonly system: SystemVariable;

  public async response(ctx: Context) {
    ctx.body = {
      value: this.system.toJSON(),
      schema: await this.system.toSchema(),
    }
  }
}

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare)
@swagger.Controller('修改系统配置', '修改系统配置', 'configs')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', t.Object({}))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number()))
@swagger.ResponseType('application/json')
class Action extends Controller {
  @Controller.Inject(SystemVariable)
  private readonly system: SystemVariable;

  public async response(ctx: Context) {
    const body: ISystemVariable = ctx.request.body;
    await this.system.save(body);
    ctx.body = Date.now();
  }
}

export default [
  Schema, Action,
]