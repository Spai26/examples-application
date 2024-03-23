import { CategoryModel } from "../../../../config/database/models/category.model";
import { Category } from "../../../domain/category.entity";

export class CategoryMapper {
  static toDomain(raw: CategoryModel): Category {
    let parentId: number | undefined = undefined;

    if (raw.parent_category) {
      parentId = raw.parent_category.id;
    }

    const category = new Category(raw.id, raw.name, parentId);

    return category;
  }
  static toPersistence(category: Category): CategoryModel {
    let parent: CategoryModel | null = null;

    if (category.parent_category_id) {
      parent = new CategoryModel();
      parent.id = category.id;
      parent.name = category.name;
    }

    const categoryEntity = new CategoryModel();
    if (category.id && typeof category.id === "number") {
      categoryEntity.id = category.id;
    }
    (categoryEntity.name = category.name),
      (categoryEntity.parent_category = parent);
    return categoryEntity;
  }
}
