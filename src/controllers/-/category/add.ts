import { Controller } from "@braken/http";
import { JSONErrorCatch } from "../../../middlewares/json";
import { AdminWare } from "../../../middlewares/user.login";
import { DataBaseWare } from "@braken/http-plugin-typeorm";
import { Context } from "koa";
import { swagger } from "../../../swagger";
import { HttpBodyWare } from "../../../middlewares/body";
import { CategoryService } from "../../../services/category.service";

@Controller.Injectable
@Controller.Method('POST')
@Controller.Middleware(JSONErrorCatch, HttpBodyWare, AdminWare, DataBaseWare)
@swagger.Controller('添加分类', '添加新的分类', 'category')
@swagger.ContentType('application/json')
@swagger.Parameter('body', 'body', swagger.ref('CategoryRequest'))
@swagger.Response(200, JSONErrorCatch.Wrap(swagger.ref('CategoryResponse')))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject(CategoryService)
  private readonly service: CategoryService;
  async response(ctx: Context) {
    const body = ctx.request.body;
    const category = await this.service.add(body.name, body.link);
    ctx.body = category;
  }
}