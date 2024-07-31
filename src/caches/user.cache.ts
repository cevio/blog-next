import { Cache } from '@braken/cache';
import { BlogUserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Exception } from '../exception';
import { Language } from '../apps/language.app';

interface Params {
  id: string
}

export type UserContextState = Pick<BlogUserEntity, 'id' |
  'account' | 'admin' | 'avatar' | 'email' | 'forbiden' |
  'gmt_create' | 'gmt_modified' | 'nickname' | 'password' |
  'salt' | 'thirdpart' | 'thirdpart_node_module' | 'token' | 'website'>

@Cache.Injectable
@Cache.Path('/user/:id')
export class UserCache extends Cache<UserContextState, Params> {
  @Cache.Inject(UserService)
  public readonly service: UserService;

  @Cache.Inject(Language)
  private readonly lang: Language;

  public async execute(params: Params) {
    const user = await this.service.getOneById(Number(params.id));
    if (!user) throw new Exception(404, this.lang.get('user.notfound'));
    return {
      value: user,
    }
  }
}