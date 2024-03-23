export class Category {
  constructor(
    public id: number,
    public name: string,
    public parent_category_id?: number
  ) {}
}
