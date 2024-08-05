import Http, { Controller } from "@braken/http";
import { Application } from "@braken/application";

@Application.Injectable
export abstract class Plugin extends Application {
  public abstract readonly name: string;
  public abstract readonly version: string;
  public abstract readonly description: string;

  @Controller.Inject(Http)
  public readonly http: Http;

  public loadControllers(directory: string) {
    return this.http.load(directory, {
      prefix: '/-/plugin/' + this.name,
    })
  }
}