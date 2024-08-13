import { TypeORMService } from '@braken/http-plugin-typeorm';
import { BlogCategoryEntity } from '../entities/category.entity';

@TypeORMService.Injectable
export class CategoryService extends TypeORMService {
  private readonly rep = this.getRepository(BlogCategoryEntity);

  public save(target: BlogCategoryEntity) {
    return this.rep.save(target);
  }

  public add(name: string, link?: string) {
    return this.save(this.rep.create().add(name, link));
  }

  public query() {
    return this.rep.find();
  }

  public getOne(id: number) {
    return this.rep.findOneBy({ id });
  }

  public remove(category: BlogCategoryEntity) {
    return this.rep.remove(category);
  }
}