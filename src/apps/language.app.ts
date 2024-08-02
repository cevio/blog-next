import i18next, { Resource } from 'i18next';
import { Application } from "@braken/application";
import { NestedKeys } from '../types';
import { Lang } from '../languages/types';
import { glob } from 'glob';
import { resolve } from 'node:path';

@Application.Injectable
export class Language extends Application {
  private readonly langs = new Map<string, Lang>();
  public readonly i18n = i18next;
  public initialize() { }

  public async init(lang: string) {
    const resources: Record<string, { translation: Lang }> = {};
    for (const [key, value] of this.langs.entries()) {
      resources[key] = {
        translation: value,
      }
    }
    await i18next.init({
      lng: lang,
      debug: false,
      resources: resources,
    });
  }

  public set(name: string, lang: Lang) {
    this.langs.set(name, lang);
    return this;
  }

  public get(key: NestedKeys<Lang> | NestedKeys<Lang>[]) {
    return this.i18n.t(key);
  }

  public async load(directory: string) {
    const files = await glob(`**/*.lang.{ts,js}`, { cwd: directory });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.substring(0, file.length - 8);
      const lang: Lang = (await import(resolve(directory, file))).default;
      this.set(path, lang);
    }
  }

  public names() {
    return Array.from(this.langs.keys());
  }
}