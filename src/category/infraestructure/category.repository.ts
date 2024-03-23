import { Category } from "../domain/category.entity";

export abstract class CategoryRepository {
  abstract create(data: Omit<Category, "id">): Promise<Category>;
}
