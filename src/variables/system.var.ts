import t from "@braken/json-schema";
import { Variable } from "./variable";
import { meta } from '../meta';

export interface ISystemVariable {
  swagger: boolean,
  requestBodyJSONLimit: number,
  requestBodyFORMLimit: number,
  requestBodyTextLimit: number,
  websiteClosed: boolean,
  websiteClosedReason: string,
}

@Variable.Injectable
export class SystemVariable extends Variable<ISystemVariable> {
  public readonly namespace = meta.name + '/system';
  public readonly schema = t.Object({
    swagger: t.Boolean(true).title('是否开启Swagger').description('开启Swagger能力，在开发阶段可以通过 Swagger 系统调试开发 API'),
    requestBodyJSONLimit: t.Number(10).title('JSON体积').description('请求体JSON数据单词传输最大体积，单位MB'),
    requestBodyFORMLimit: t.Number(10).title('FORM体积').description('请求体FORM表单数据单词传输最大体积，单位MB'),
    requestBodyTextLimit: t.Number(10).title('TEXT体积').description('请求体TEXT数据单词传输最大体积，单位MB'),
    websiteClosed: t.Boolean(false).title('网站关闭').description('是否使网站关闭，关闭后，后台登录不受影响'),
    websiteClosedReason: t.String('抱歉网站已关闭').title('关闭原因').description('自定义网站关闭原因'),
  });
}