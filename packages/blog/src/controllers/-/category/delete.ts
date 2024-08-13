import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { JSONErrorCatch } from "../../../middlewares/json";
import { AdminWare } from "../../../middlewares/user.login";
import { DataBaseWare } from "@braken/http-plugin-typeorm";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { CategoryService } from "../../../services/category.service";
import { Exception } from '../../../exception';
import { Language } from '../../../apps/language.app';

@Controller.Injectable
@Controller.Method('DELETE')
@Controller.Middleware(JSONErrorCatch, AdminWare, DataBaseWare)
@swagger.Controller('删除分类', '删除分类', 'category')
@swagger.ContentType('application/json')
@swagger.Parameter('id', 'path', t.Number())
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now())))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly service: CategoryService;
  @Controller.Inject(Language)
  private readonly lang: Language;
  async response(ctx: Context) {
    const id = Number(ctx.params.id);
    const category = await this.service.getOne(id);
    if (!category) {
      throw new Exception(404, this.lang.get('category.notfound'));
    }
    await this.service.remove(category);
    ctx.body = Date.now();
  }
}