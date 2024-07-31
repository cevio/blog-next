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
import { LoginService } from '../../services/login.service';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, WebSiteClosedWare, HttpBodyWare, DataBaseTransactionWare)
@swagger.Controller('系统用户登录', '博客默认系统登录，通过账号密码登录系统。', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', swagger.ref('LoginForm'))
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

    // 用户是否存在
    let user = await this.service.getOneByAccount(body.account);
    if (!user) {
      throw new Exception(404, this.lang.get('user.notfound'));
    }

    // 判断密码是否正确
    if (!user.checkPassword(body.password)) {
      throw new Exception(410, this.lang.get('user.pwderror'));
    }

    // 更新数据库
    await this.service.save(
      user
        .updatePassword(body.password)
        .updateToken()
    );

    // 缓存
    const _user = await this.cache.$write({
      id: user.id.toString(),
    });

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