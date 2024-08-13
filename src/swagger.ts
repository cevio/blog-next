import HttpSwagger from '@braken/http-swagger';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { compile } from 'ejs';
import { getMetaByController } from '@braken/http';
import { meta } from './meta';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const swagger = new HttpSwagger({
  user: '用户中心',
  category: '分类管理',
  configs: '设置',
  control: '后台页面'
})

swagger.basePath = '/';
swagger.info = {
  title: meta.name,
  version: meta.version,
  description: meta.description,
}

export async function createSwaggerHtml() {
  const swaggerTemplateString = readFileSync(resolve(__dirname, '../swagger/index.ejs'), 'utf8');
  const render = compile(swaggerTemplateString);
  const target = await import('./controllers/-/swagger.controller');
  const controller = getMetaByController(target.default);
  return render({
    title: swagger.info.title,
    api: controller[0].router,
  })
}