import i18next, { Resource } from 'i18next';
import { Application } from "@braken/application";
import { NestedKeys } from '../types';

export interface Lang {
  swagger: {
    unsupport: string,
  },
  user: {
    notfound: string,
    pwderror: string,
  }
}

@Application.Injectable
export class Language extends Application {
  private readonly langs = new Map<string, Lang>();
  public readonly i18n = i18next;
  public initialize() { }

  public async init() {
    const resources: Record<string, { translation: Lang }> = {};
    for (const [key, value] of this.langs.entries()) {
      resources[key] = {
        translation: value,
      }
    }
    await i18next.init({
      lng: 'zhcn',
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
}