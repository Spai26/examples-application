import { QueryOpt } from "./querys.repository";

export abstract class ReadRepositoy<T> {
  /*  abstract getOne(query: QueryOpt<T>): Promise<T | null>; */
  abstract get(query: QueryOpt<T>): Promise<T[]>;
  /* abstract getAndCount(query: QueryOpt<T>): Promise<[T[], number]>; */
}

export abstract class WriteRepositoy<T> {
  abstract save(entity: T): Promise<T | null>;
  abstract update(id: string | number, update: Partial<T>): Promise<boolean>;
  abstract delete(id: string | number): Promise<boolean>;
}
