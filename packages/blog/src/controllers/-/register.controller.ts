import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { WebSiteClosedWare } from '../../middlewares/close';
import { HttpBodyWare } from '../../middlewares/body';
import { DataBaseTransactionWare } from '@braken/http-plugin-typeorm';
import { UserVariable } from '../../variables/user.var';
import { Exception } from '../../exception';
import { Language } from '../../apps/language.app';
import { UserService } from '../../services/user.service';
import { UserCache } from '../../caches/user.cache';
import { LoginService } from '../../services/login.service';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, WebSiteClosedWare, HttpBodyWare, DataBaseTransactionWare)
@swagger.Controller('用户注册', '通过账号密码注册用户', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', swagger.ref('LoginForm'))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(UserVariable)
  private readonly user: UserVariable;

  @Controller.Inject(Language)
  private readonly lang: Language;

  @Controller.Inject(UserService)
  private readonly service: UserService;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  @Controller.Inject(LoginService)
  private readonly login: LoginService;

  public async response(ctx: Context) {
    if (!this.user.get('registable')) {
      throw new Exception(413, this.lang.get('user.unregist'));
    }

    const body = ctx.request.body;
    let user = await this.service.getOneByAccount(body.account);
    if (user) {
      throw new Exception(414, this.lang.get('user.exists'));
    }

    user = await this.service.create(body.account, body.password);
    const _user = await this.cache.$write({ id: user.id.toString() });

    const expire = await this.login.createCache(_user);
    const domain = new URL('http://' + ctx.headers.host);

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