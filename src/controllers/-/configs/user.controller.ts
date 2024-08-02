import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { JSONErrorCatch } from '../../../middlewares/json';
import { AdminWare } from '../../../middlewares/user.login';
import { HttpBodyWare } from '../../../middlewares/body';
import { IUserVariable, UserVariable } from '../../../variables/user.var';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, AdminWare)
@swagger.Controller('用户配置', '获取用户配置', 'configs')
@swagger.ContentType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Object({})))
@swagger.ResponseType('application/json')
class Schema extends Controller {
  @Controller.Inject(UserVariable)
  private readonly user: UserVariable;

  public async response(ctx: Context) {
    ctx.body = {
      value: this.user.toJSON(),
      schema: await this.user.toSchema(),
    }
  }
}

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare)
@swagger.Controller('修改用户配置', '修改用户配置', 'configs')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', t.Object({}))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number()))
@swagger.ResponseType('application/json')
class Action extends Controller {
  @Controller.Inject(UserVariable)
  private readonly user: UserVariable;

  public async response(ctx: Context) {
    const body: IUserVariable = ctx.request.body;
    await this.user.save(body);
    ctx.body = Date.now();
  }
}

export default [
  Schema, Action,
]