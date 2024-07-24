import { TypeORMService } from '@braken/http-plugin-typeorm';
import { BlogUserEntity } from '../entities/user.entity';
import { FindOptionsWhere } from 'typeorm';

@TypeORMService.Injectable
export class UserService extends TypeORMService {
  private readonly rep = this.getRepository(BlogUserEntity);

  public save(target: BlogUserEntity) {
    return this.rep.save(target);
  }

  public getOneByAccount(account: string, thirdpart?: string) {
    const conditions: FindOptionsWhere<BlogUserEntity> = {
      account,
      thirdpart: false,
    }
    if (thirdpart) {
      conditions.thirdpart = true;
      conditions.thirdpart_node_module = thirdpart;
    }
    return this.rep.findOneBy(conditions);
  }
}