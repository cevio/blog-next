import t from '@braken/json-schema';
import { Controller } from "@braken/http";
import { Context } from "koa";
import { swagger } from "../../swagger";
import { JSONErrorCatch } from '../../middlewares/json';
import { SwaggerUseable } from '../../middlewares/swagger';

@Controller.Injectable
@Controller.Method('GET')
@Controller.Middleware(JSONErrorCatch, SwaggerUseable)
@swagger.Controller('swagger数据', '获取 swagger 数据')
@swagger.Response(200, JSONErrorCatch.Wrap(t.Object({})))
@swagger.ResponseType('application/json')
export default class extends Controller {
  @Controller.Inject('swagger:data')
  private readonly data: any;

  public async response(ctx: Context) {
    ctx.body = this.data;
  }
}