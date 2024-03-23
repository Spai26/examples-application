export type Operator =
  | "EQUAL"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "NOT_EQUAL"
  | "IN"
  | "NOT_IN"
  | "LIKE"
  | "BETWEEN";

export type FilterValue<T> = T | string | (T | null | undefined)[];
export type FilterObject<T> = Record<keyof T, FilterValue<T[keyof T]>>;

interface IOrder<T> {
  field: keyof T;
  direction: "ASC" | "DESC" | "NONE";
}

export class QueryOpt<T> {
  readonly filters: FilterObject<T>;
  readonly orders: IOrder<T>[];
  readonly limit?: number;
  readonly offset?: number;

  constructor(
    filters: FilterObject<T> = {} as FilterObject<T>,
    orders: IOrder<T>[] = [],
    limit?: number,
    offset?: number
  ) {
    this.filters = filters;
    this.orders = orders;
    this.limit = limit;
    this.offset = offset;
  }

  where<K extends keyof T>(
    field: K,
    value: FilterValue<T[K]>,
    operator: Operator = "EQUAL"
  ): QueryOpt<T> {
    return new QueryOpt<T>(
      { ...this.filters, [field]: { value, operator } },
      this.orders,
      this.limit,
      this.offset
    );
  }

  orderBy(
    field: keyof T,
    direction: "ASC" | "DESC" | "NONE" = "ASC"
  ): QueryOpt<T> {
    return new QueryOpt<T>(
      {
        ...this.filters,
      },
      [...this.orders, { field, direction }],
      this.limit,
      this.offset
    );
  }

  take(limit: number): QueryOpt<T> {
    return new QueryOpt<T>(this.filters, this.orders, limit, this.offset);
  }

  skip(offset: number): QueryOpt<T> {
    return new QueryOpt<T>(this.filters, this.orders, this.limit, offset);
  }
}
