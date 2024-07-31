import { Component } from '@braken/injection';
import { UserVariable } from '../variables/user.var';
import { UserContextState } from '../caches/user.cache';
import CacheServer from '@braken/cache';

@Component.Injectable
export class LoginService extends Component {
  @Component.Inject(UserVariable)
  private readonly variable: UserVariable;

  @Component.Inject(CacheServer)
  private readonly cache: CacheServer;

  public async updateCache(user: UserContextState) {
    const maxAgeSec = Date.now() + this.variable.get('loginExpire') * 24 * 60 * 60 * 1000;
    const userTokenCacheKey = '/login/token/' + user.token;
    const userAccountCacheKey = '/login/account/' + user.id;

    // 清理旧缓存
    const token = await this.cache.read(userAccountCacheKey);
    if (token) {
      await this.cache.remove('/login/token/' + token);
    }

    // 写入新缓存
    await this.cache.write(userTokenCacheKey, user.id, maxAgeSec);
    await this.cache.write(userAccountCacheKey, user.token, maxAgeSec);

    return maxAgeSec;
  }

  public async removeCache(id: number) {
    const userAccountCacheKey = '/login/account/' + id;
    const token = await this.cache.read(userAccountCacheKey);
    if (token) {
      const userTokenCacheKey = '/login/token/' + token;
      await this.cache.remove(userTokenCacheKey);
      await this.cache.remove(userAccountCacheKey);
    }
  }

  public async createCache(user: UserContextState) {
    const maxAgeSec = Date.now() + this.variable.get('loginExpire') * 24 * 60 * 60 * 1000;
    const userTokenCacheKey = '/login/token/' + user.token;
    const userAccountCacheKey = '/login/account/' + user.id;

    // 写入新缓存
    await this.cache.write(userTokenCacheKey, user.id, maxAgeSec);
    await this.cache.write(userAccountCacheKey, user.token, maxAgeSec);

    return maxAgeSec;
  }
}