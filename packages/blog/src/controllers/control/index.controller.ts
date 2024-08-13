import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { PlainErrorCatch } from '../../middlewares/json';
import { AuthorizeWare } from '../../middlewares/user.info';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(PlainErrorCatch, AuthorizeWare)
@swagger.Controller('后台首页', '后台首页', 'control')
@swagger.ResponseType('application/json')
@swagger.Response(200, t.String())
export default class extends Controller {
  public async response(ctx: Context) {
    ctx.body = 'hhh'
  }
}