import t from "@braken/json-schema";
import { Variable } from "./variable";
import { meta } from '../meta';

export interface ISystemVariable {
  swagger: boolean,
  requestBodyJSONLimit: number,
  requestBodyFORMLimit: number,
  requestBodyTextLimit: number,
}

@Variable.Injectable
export class SystemVariable extends Variable<ISystemVariable> {
  public readonly namespace = meta.name + '/system';
  public readonly schema = t.Object({
    swagger: t.Boolean(true).title('是否开启Swagger').description('开启Swagger能力，在开发阶段可以通过 Swagger 系统调试开发 API'),
    requestBodyJSONLimit: t.Number(10).title('请求体JSON数据单词传输最大体积，单位MB'),
    requestBodyFORMLimit: t.Number(10).title('请求体FORM表单数据单词传输最大体积，单位MB'),
    requestBodyTextLimit: t.Number(10).title('请求体TEXT数据单词传输最大体积，单位MB'),
  });
}