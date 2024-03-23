export class CreateCategoryDto {
  public constructor(public name: string, public parent_category_id: number) {}
}
