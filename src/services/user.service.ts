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

  public getOneById(id: number) {
    return this.rep.findOneBy({ id });
  }

  public create(account: string, password: string) {
    return this.save(this.rep.create().add(account, password))
  }

  public async query(page: number, size: number, options: {
    keyword?: string,
    forbiden?: boolean,
    admin?: boolean
  } = {}) {
    const sql = this.rep.createQueryBuilder('u')
      .where('1=1')
      .orderBy({
        'u.gmt_create': 'DESC',
        'u.gmt_modified': 'DESC',
      });

    if (options.keyword) {
      sql.andWhere('u.account LIKE :keyword OR u.nickname LIKE :keyword', {
        keyword: '%' + options.keyword + '%'
      });
    }

    if (options.forbiden) {
      sql.andWhere('u.forbiden=:forbiden', {
        forbiden: true
      });
    }

    if (options.admin) {
      sql.andWhere('u.admin=:admin', {
        admin: true,
      })
    }

    if (size) {
      sql.offset((page - 1) * size).limit(size);
    }

    return await sql.getManyAndCount();
  }
}