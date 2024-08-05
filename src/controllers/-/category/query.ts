import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { JSONErrorCatch } from "../../../middlewares/json";
import { AdminWare } from "../../../middlewares/user.login";
import { DataBaseWare } from "@braken/http-plugin-typeorm";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { CategoryService } from "../../../services/category.service";

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, AdminWare, DataBaseWare)
@swagger.Controller('分类列表', '获取分类的列表', 'category')
@swagger.ContentType('application/json')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Array([]).items(swagger.ref('CategoryResponse'))))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly service: CategoryService;
  async response(ctx: Context) {
    const data = await this.service.query();
    ctx.body = data.sort((a, b) => a.cate_order - b.cate_order);
  }
}