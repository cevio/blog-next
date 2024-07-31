import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../../../swagger";
import { JSONErrorCatch } from '../../../../middlewares/json';
import { AdminWare } from '../../../../middlewares/user.login';
import { DataBaseTransactionWare } from '@braken/http-plugin-typeorm';
import { UserService } from '../../../../services/user.service';
import { Exception } from '../../../../exception';
import { Language } from '../../../../apps/language.app';
import { UserCache } from '../../../../caches/user.cache';
import { HttpBodyWare } from '../../../../middlewares/body';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare, DataBaseTransactionWare)
@swagger.Controller('设置管理员', '成为/取消管理员权限', 'user')
@swagger.ContentType('application/json')
@swagger.Parameter('id', 'path', t.Number(0))
@swagger.Parameter('body', 'body', swagger.ref('BooleanValue'))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now()).description('时间戳')))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(UserService)
  private readonly service: UserService;

  @Controller.Inject(Language)
  private readonly lang: Language;

  @Controller.Inject(UserCache)
  private readonly cache: UserCache;

  public async response(ctx: Context) {
    let user = await this.service.getOneById(Number(ctx.params.id));
    if (!user) {
      throw new Exception(404, this.lang.get('user.notfound'));
    }
    if (user.id === ctx.user.id) {
      throw new Exception(411, this.lang.get('user.unaccept'));
    }

    user = await this.service.save(user.updateForbiden(ctx.request.body.value));
    await this.cache.$write({ id: user.id.toString() });
    ctx.body = Date.now();
  }
}