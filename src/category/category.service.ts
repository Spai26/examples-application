import { Category } from "./domain/category.entity";
import { CreateCategoryDto } from "./domain/dto/create-category-dto";
import { CategoryRepository } from "./infraestructure/category.repository";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(createCategoryDto);
  }
}
