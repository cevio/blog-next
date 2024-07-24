import t from '@braken/json-schema';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../swagger";

@Controller.Injectable
@Controller.Method('GET')
@swagger.Controller('首页', '博客首页')
@swagger.Response(200, t.String())
@swagger.ResponseType('text/html')
export default class extends Controller {
  public async response(ctx: Context) {
    ctx.body = 'hello world!'
  }
}