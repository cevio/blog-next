import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { LoginWare } from '../../middlewares/user.login';
import { LoginService } from '../../services/login.service';

@Controller.Injectable
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, LoginWare)
@swagger.Controller('退出登录', '当前登录的用户退出系统登录', 'user')
@swagger.ResponseType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
export default class extends Controller {
  @Controller.Inject(LoginService)
  private readonly login: LoginService;

  public async response(ctx: Context) {
    const domain = new URL('http://' + ctx.headers.host);
    await this.login.removeCache(ctx.user.id);
    ctx.cookies.set('authorization', '', {
      expires: new Date(0),
      signed: true,
      path: '/',
      httpOnly: true,
      domain: '.' + domain.hostname,
    })

    ctx.body = Date.now();
  }
}