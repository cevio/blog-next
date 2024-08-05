import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { JSONErrorCatch } from "../../../middlewares/json";
import { AdminWare } from "../../../middlewares/user.login";
import { DataBaseTransactionWare } from "@braken/http-plugin-typeorm";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { HttpBodyWare } from "../../../middlewares/body";
import { CategoryService } from "../../../services/category.service";
import { Exception } from '../../../exception';
import { Language } from '../../../apps/language.app';

@Controller.Injectable
@Controller.Method('PUT')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare, DataBaseTransactionWare)
@swagger.Controller('更新分类排序', '更新分类排序', 'category')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', t.Array([]).items(t.Number()))
@swagger.Response(200, JSONErrorCatch.Wrap(t.Number(Date.now())))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly service: CategoryService;

  @Controller.Inject(Language)
  private readonly lang: Language;

  async response(ctx: Context) {
    const body: number[] = ctx.request.body;
    for (let i = 0; i < body.length; i++) {
      const id = body[i];
      const category = await this.service.getOne(id);
      if (!category) {
        throw new Exception(404, this.lang.get('category.notfound'));
      }
      await this.service.save(category.updateOrder(i));
    }
    ctx.body = Date.now();
  }
}