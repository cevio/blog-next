import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { AuthorizeWare } from '../../middlewares/user.info';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, AuthorizeWare)
@swagger.Controller('登录信息', '获取当前登录用户的状态以及信息', 'user')
@swagger.ResponseType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Object({
  account: t.String(),
  nickname: t.String(),
  email: t.String(),
  avatar: t.String(),
  website: t.String(),
  admin: t.Boolean(),
  status: t.Boolean().required(),
})))
export default class extends Controller {
  public async response(ctx: Context) {
    if (!ctx.user) {
      ctx.body = {
        status: false,
      };
    } else {
      ctx.body = {
        account: ctx.user.account,
        nickname: ctx.user.nickname,
        email: ctx.user.email,
        avatar: ctx.user.avatar,
        website: ctx.user.website,
        admin: ctx.user.admin,
        status: true,
      }
    }
  }
}