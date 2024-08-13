import t from '@braken/json-schema';

import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../swagger";
import { PlainErrorCatch } from '../middlewares/json';
import { SwaggerUseable } from '../middlewares/swagger';
import { WebSiteClosedWare } from '../middlewares/close';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(PlainErrorCatch, WebSiteClosedWare, SwaggerUseable)
@swagger.Controller('swagger 页面', '生成 swagger 前端页面')
@swagger.Response(200, t.String())
@swagger.Response(502, t.String())
@swagger.ResponseType('text/html')
export default class extends Controller {
  @Controller.Inject('swagger:html')
  private readonly html: string;

  public async response(ctx: Context) {
    ctx.body = this.html;
    ctx.type = '.html';
  }
}