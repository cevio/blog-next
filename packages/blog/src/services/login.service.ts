import CacheServer from '@braken/cache';
import { Component } from '@braken/injection';
import { UserVariable } from '../variables/user.var';
import { UserContextState } from '../caches/user.cache';

@Component.Injectable
export class LoginService extends Component {
  @Component.Inject(UserVariable)
  private readonly variable: UserVariable;

  @Component.Inject(CacheServer)
  private readonly cache: CacheServer;

  static createTokenKey(token: string) {
    return '/login/token/' + token;
  }

  static createAccountKey(id: number) {
    return '/login/account/' + id;
  }

  public useToken(token: string) {
    const key = LoginService.createTokenKey(token);
    return {
      key,
      has: () => this.cache.has(key),
      read: (): Promise<number> => this.cache.read(key),
      remove: () => this.cache.remove(key),
      write: (id: number, expire?: number) => this.cache.write(key, id, expire),
    }
  }

  public useId(id: number) {
    const key = LoginService.createAccountKey(id);
    return {
      key,
      has: () => this.cache.has(key),
      read: (): Promise<string> => this.cache.read(key),
      remove: () => this.cache.remove(key),
      write: (token: string, expire?: number) => this.cache.write(key, token, expire),
    }
  }

  private getExpire() {
    return Date.now() + this.variable.get('loginExpire') * 24 * 60 * 60 * 1000;
  }

  public async updateCache(user: UserContextState) {
    const IdMachine = this.useId(user.id);
    const TokenMachine = this.useToken(user.token);
    const maxAgeSec = this.getExpire();

    // 清理旧缓存
    if (await IdMachine.has()) {
      const token = await IdMachine.read();
      if (token) {
        const { remove, has } = this.useToken(token);
        if (await has()) {
          await remove();
        }
      }
    }

    // 写入新缓存
    await TokenMachine.write(user.id, maxAgeSec);
    await IdMachine.write(user.token, maxAgeSec);

    return maxAgeSec;
  }

  public async removeCache(id: number) {
    const IdMachine = this.useId(id);
    if (await IdMachine.has()) {
      const token = await IdMachine.read();
      if (token) {
        const TokenMachine = this.useToken(token);
        if (await TokenMachine.has()) {
          await TokenMachine.remove();
        }
      }
      await IdMachine.remove();
    }
  }

  public async createCache(user: UserContextState) {
    const IdMachine = this.useId(user.id);
    const TokenMachine = this.useToken(user.token);
    const maxAgeSec = this.getExpire();

    // 写入新缓存
    await IdMachine.write(user.token, maxAgeSec);
    await TokenMachine.write(user.id, maxAgeSec);

    return maxAgeSec;
  }
}