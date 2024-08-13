import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "@pjblog/blog";

@Controller.Injectable
@Controller.Method('GET')
@swagger.Controller('测试', '插件路由测试')
@swagger.Response(200, swagger.ref('BooleanString'))
@swagger.ResponseType('text/html')
export default class extends Controller {
  public async response(ctx: Context) {
    ctx.body = 'hello world!'
  }
}