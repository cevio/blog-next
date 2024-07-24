import { Cache } from '@braken/cache';
import { BlogUserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Exception } from '../exception';
import { Language } from '../apps/language.app';

interface Params {
  account: string
}

@Cache.Injectable
export class UserCache extends Cache<BlogUserEntity, Params> {
  @Cache.Inject(UserService)
  public readonly service: UserService;

  @Cache.Inject(Language)
  private readonly lang: Language;

  public async execute(params: Params) {
    const user = await this.service.getOneByAccount(params.account);
    if (!user) throw new Exception(404, this.lang.get('user.notfound'));
    return {
      value: user,
    }
  }
}