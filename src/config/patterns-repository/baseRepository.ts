// querys generales
export interface QueryList<T> {
  getAll(query?: Partial<T>): Promise<T[]>;
  getById(id: ID): Promise<T | null>;
  getByOne(id: Partial<T>): Promise<T | null>;
  getAndCount(query?: Partial<T>): Promise<[T[], number]>;

  create(input: Partial<T>): Promise<T>;
  update(params: UpdateParams<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

// Object por si se necesita considerar mas opciones
export interface UpdateParams<T> {
  id: string | number;
  input: Partial<T>;
}

export interface ID {
  id: string | number;
}

export abstract class BaseRepository<T> implements QueryList<T> {
  private readonly adapter: QueryList<T>;

  constructor(databaseAdapter: QueryList<T>) {
    this.adapter = databaseAdapter;
  }

  async getAll(query?: Partial<T>): Promise<T[]> {
    return this.adapter.getAll(query);
  }

  async getById(id: ID): Promise<T | null> {
    return this.adapter.getById(id);
  }

  async getByOne(query: Partial<T>): Promise<T | null> {
    return this.adapter.getByOne(query);
  }

  async getAndCount(query: Partial<T>): Promise<[T[], number]> {
    return this.adapter.getAndCount(query);
  }

  async create(input: Partial<T>): Promise<T> {
    return this.adapter.create(input);
  }
  async update(params: UpdateParams<T>): Promise<T> {
    return this.adapter.update(params);
  }

  async delete(id: ID): Promise<boolean> {
    return this.adapter.delete(id);
  }
}
