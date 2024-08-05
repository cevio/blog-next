import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { JSONErrorCatch } from "../../../middlewares/json";
import { AdminWare } from "../../../middlewares/user.login";
import { DataBaseWare } from "@braken/http-plugin-typeorm";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { HttpBodyWare } from "../../../middlewares/body";
import { CategoryService } from "../../../services/category.service";
import { Exception } from '../../../exception';
import { Language } from '../../../apps/language.app';

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare, DataBaseWare)
@swagger.Controller('更新分类', '更新分类', 'category')
@swagger.ContentType('application/json')
@swagger.Parameter('id', 'path', t.Number())
@swagger.Parameter('body', 'body', swagger.ref('CategoryRequest'))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now())))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly service: CategoryService;

  @Controller.Inject(Language)
  private readonly lang: Language;

  async response(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body;
    let category = await this.service.getOne(id);
    if (!category) {
      throw new Exception(404, this.lang.get('category.notfound'));
    }
    category = category.updateName(body.name);
    if (body.link) category = category.updateLink(body.link);
    await this.service.save(category);
    ctx.body = Date.now();
  }
}