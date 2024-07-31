import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { JSONErrorCatch } from '../../../middlewares/json';
import { AdminWare } from '../../../middlewares/user.login';
import { DataBaseWare } from '@braken/http-plugin-typeorm';
import { UserService } from '../../../services/user.service';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, AdminWare, DataBaseWare)
@swagger.Controller('用户列表', '获取 swagger 数据', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('page', 'query', t.Number(1).required())
@swagger.Parameter('size', 'query', t.Number(10))
@swagger.Parameter('keyword', 'query', t.String())
@swagger.Parameter('forbiden', 'query', t.Number(0).enum(0, 1))
@swagger.Parameter('admin', 'query', t.Number(0).enum(0, 1))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Array([])))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly service: UserService;

  public async response(ctx: Context) {
    const [data, total] = await this.service.query(Number(ctx.query.page), Number(ctx.query.size || 10), {
      keyword: ctx.query.keyword as string,
      forbiden: Boolean(Number(ctx.query.forbiden)),
      admin: Boolean(Number(ctx.query.admin)),
    })
    ctx.set('x-total', total.toString());
    ctx.body = data;
  }
}