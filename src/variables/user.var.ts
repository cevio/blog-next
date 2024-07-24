import t from "@braken/json-schema";
import { Variable } from "./variable";
import { meta } from '../meta';

export interface IUserVariable {
  loginExpire: number
}

@Variable.Injectable
export class UserVariable extends Variable<IUserVariable> {
  public readonly namespace = meta.name + '/user';
  public readonly schema = t.Object({
    loginExpire: t.Number(7).title('登录有效期').description('用户登录后保持登录的时间有效期，单位：天。')
  });
}