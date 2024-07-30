import t from '@braken/json-schema';
import CacheServer from '@braken/cache';

import { DataBaseTransactionWare } from '@braken/http-plugin-typeorm';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { HttpBodyWare } from '../../middlewares/body';
import { UserService } from '../../services/user.service';
import { Language } from '../../apps/language.app';
import { Exception } from '../../exception';
import { UserCache, UserContextState } from '../../caches/user.cache';
import { WebSiteClosedWare } from '../../middlewares/close';
import { LoginWare } from '../../middlewares/user.login';
import { UserVariable } from '../../variables/user.var';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, WebSiteClosedWare, HttpBodyWare, LoginWare, DataBaseTransactionWare)
@swagger.Controller('修改个人信息', '修改登录用户的个人信息', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', swagger.ref('Profile'))
@swagger.ResponseType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly service: UserService;

  @Controller.Inject(Language)
  private readonly lang: Language;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  @Controller.Inject(UserVariable)
  private readonly variable: UserVariable;

  @Controller.Inject(CacheServer)
  private readonly cacheServer: CacheServer;

  public async response(ctx: Context) {
    const body = ctx.request.body;
    let user = await this.service.getOneByAccount(ctx.user.account);
    if (!user) {
      throw new Exception(404, this.lang.get('user.notfound'));
    }
    user = await this.service.save(user.updateProfile(body.nickname, body.email, body.avatar, body.website));
    const _user = await this.cache.$write({ account: user.account });
    await this.toCache(_user);
    ctx.body = Date.now();
  }

  private async toCache(user: UserContextState) {
    const maxAgeSec = Date.now() + this.variable.get('loginExpire') * 24 * 60 * 60 * 1000;
    const userTokenCacheKey = '/login/token/' + user.token;

    await this.cacheServer.write(userTokenCacheKey, user, maxAgeSec);
  }
}