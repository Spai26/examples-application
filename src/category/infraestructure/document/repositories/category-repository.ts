import { Category } from "category/domain/category.entity";
import { CategoryRepository } from "../../category.repository";
import { Repository } from "typeorm";
import { CategoryModel } from "../../../../config/database/models/category.model";
import { CategoryMapper } from "../mappers/category.mapper";

export class CategoryDocumentRepository implements CategoryRepository {
  private readonly categoryModel: Repository<CategoryModel>;

  constructor(categoryModel: Repository<CategoryModel>) {
    this.categoryModel = categoryModel;
  }
  async create(data: Category): Promise<Category> {
    const persisModel = CategoryMapper.toPersistence(data);
    const createCategory = this.categoryModel.create(persisModel);
    const categoryObject = await createCategory.save();
    return CategoryMapper.toDomain(categoryObject);
  }
}
