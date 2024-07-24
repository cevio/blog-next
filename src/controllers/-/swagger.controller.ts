import t from '@braken/json-schema';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { SystemVariable } from '../../variables/system.var';
import { Exception } from '../../exception';
import { Language } from '../../apps/language.app';
import { JSONErrorCatch } from '../../middlewares/json';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch)
@swagger.Controller('swagger数据', '获取 swagger 数据')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Object({})))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject('swagger:data')
  private readonly data: any;

  @Controller.Inject(SystemVariable)
  private readonly system: SystemVariable;

  @Controller.Inject(Language)
  private readonly lang: Language;

  public async response(ctx: Context) {
    if (!this.system.get('swagger')) {
      throw new Exception(502, this.lang.get('swagger.unsupport'));
    }
    ctx.body = this.data;
  }
}