import t from '@braken/json-schema';
import CacheServer from '@braken/cache';
import HttpTypeormPlugin from '@braken/http-plugin-typeorm';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { AuthorizeWare } from '../../middlewares/user.info';
import { LoginWare } from '../../middlewares/user.login';

@Controller.Injectable
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, HttpTypeormPlugin.Middleware(), AuthorizeWare, LoginWare)
@swagger.Controller('退出登录', '当前登录的用户退出系统登录', 'user')
@swagger.ResponseType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
export default class extends Controller {
  @Controller.Inject(CacheServer)
  private readonly cacheServer: CacheServer;

  public async response(ctx: Context) {
    const account = ctx.user.account;
    const userAccountCacheKey = '/login/account/' + account;
    const token = await this.cacheServer.read(userAccountCacheKey);
    if (token) {
      const userTokenCacheKey = '/login/token/' + token;
      await this.cacheServer.remove(userTokenCacheKey);
      await this.cacheServer.remove(userAccountCacheKey);
    }

    const domain = new URL(ctx.headers.host);
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