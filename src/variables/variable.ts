import CacheServer from "@braken/cache";
import { Application } from "@braken/application";
import { JSONSchemaObject } from "@braken/json-schema";

@Application.Injectable
export abstract class Variable<T extends object = any> extends Application {
  public abstract namespace: string;
  public abstract schema: JSONSchemaObject<'object'>;
  public readonly state = new Map<keyof T, any>();

  @Application.Inject(CacheServer)
  private readonly server: CacheServer;

  get key() {
    return '/variable/' + this.namespace + '/state';
  }

  public async initialize() {
    const data = this.toSchema();
    // @ts-ignore
    const properties = data.properties;
    for (const key in properties) {
      const item = properties[key];
      this.state.set(key as keyof T, item.default);
    }
    const json = await this.server.read(this.key);
    if (json) {
      for (const key of this.state.keys()) {
        if (json[key] !== undefined) {
          this.state.set(key, json[key]);
        }
      }
    }
  }

  public toSchema() {
    return this.schema.toJSON();
  }

  public get<U extends keyof T>(key: U): T[U] {
    return this.state.get(key);
  }

  public set<U extends keyof T>(key: U, value: T[U]) {
    if (this.state.has(key)) {
      this.state.set(key, value);
    }
    return this;
  }

  public toJSON(): T {
    const data: Partial<Record<keyof T, any>> = {}
    for (const [key, value] of this.state.entries()) {
      data[key] = value;
    }
    return data as T;
  }

  public async save(value: Partial<T>) {
    for (const key in value) {
      if (this.state.has(key)) {
        this.state.set(key, value[key]);
      }
    }
    return await this.server.write(this.key, this.toJSON());
  }

  public async update<U extends keyof T>(key: U, value: T[U]) {
    this.set(key, value);
    return await this.server.write(this.key, this.toJSON());
  }
}