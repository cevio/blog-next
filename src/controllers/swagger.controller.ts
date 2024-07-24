import t from '@braken/json-schema';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../swagger";
import { SystemVariable } from '../variables/system.var';
import { PlainErrorCatch } from '../middlewares/json';
import { Exception } from '../exception';
import { Language } from '../apps/language.app';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(PlainErrorCatch)
@swagger.Controller('swagger 页面', '生成 swagger 前端页面')
@swagger.Response(200, t.String())
@swagger.Response(502, t.String())
@swagger.ResponseType('text/html')
export default class extends Controller {
  @Controller.Inject('swagger:html')
  private readonly html: string;

  @Controller.Inject(SystemVariable)
  private readonly system: SystemVariable;

  @Controller.Inject(Language)
  private readonly lang: Language;

  public async response(ctx: Context) {
    if (!this.system.get('swagger')) {
      throw new Exception(502, this.lang.get('swagger.unsupport'));
    }
    ctx.body = this.html;
    ctx.type = '.html';
  }
}