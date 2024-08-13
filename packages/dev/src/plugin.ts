import { Plugin, swagger, Language } from '@pjblog/blog';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

@Plugin.Injectable
export class TestPlugin extends Plugin {
  public readonly name = 'pjblog-plugin-test';
  public readonly version = '1.0.0';
  public readonly description = '测试插件';

  @Plugin.Inject(Language)
  private readonly lang: Language;

  async initialize() {
    await this.loadControllers(__dirname);
    await swagger.autoLoadDefinitons(__dirname);
    await this.lang.load(__dirname);
  }
}
