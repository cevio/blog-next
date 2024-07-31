import t from '@braken/json-schema';

import { DataBaseTransactionWare } from '@braken/http-plugin-typeorm';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { HttpBodyWare } from '../../middlewares/body';
import { UserService } from '../../services/user.service';
import { Language } from '../../apps/language.app';
import { Exception } from '../../exception';
import { UserCache } from '../../caches/user.cache';
import { WebSiteClosedWare } from '../../middlewares/close';
import { LoginWare } from '../../middlewares/user.login';
import { LoginService } from '../../services/login.service';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, WebSiteClosedWare, HttpBodyWare, LoginWare, DataBaseTransactionWare)
@swagger.Controller('修改密码', '修改登录用户的密码', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', swagger.ref('ResetPassword'))
@swagger.ResponseType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly service: UserService;

  @Controller.Inject(Language)
  private readonly lang: Language;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  @Controller.Inject(LoginService)
  private readonly login: LoginService;

  public async response(ctx: Context) {
    const body = ctx.request.body;
    let user = await this.service.getOneByAccount(ctx.user.account);

    if (!user) {
      throw new Exception(404, this.lang.get('user.notfound'));
    }

    if (!user.checkPassword(body.oldPassword)) {
      throw new Exception(410, this.lang.get('user.pwderror'));
    }

    user = await this.service.save(user.updatePassword(body.newPassword).updateToken());
    const _user = await this.cache.$write({ id: user.id.toString() });

    const expire = await this.login.updateCache(_user);
    const domain = new URL('http://' + ctx.headers.host);

    // 写入 cookie
    ctx.cookies.set('authorization', user.token, {
      expires: new Date(expire),
      signed: true,
      path: '/',
      httpOnly: true,
      domain: '.' + domain.hostname,
    })

    ctx.body = Date.now();
  }
}