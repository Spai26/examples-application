export type Schemaissue = {
  paths?: boolean;
  message: string;
};
// helpers
type NonNullable<T> = T & {};

// response message
type recursiveSchemaFormattedError<T> = T extends [any, ...any[]]
  ? { [K in keyof T]?: SchemaFormatError<T[K]> }
  : T extends any[]
  ? { [k: number]: SchemaFormatError<T[number]> }
  : T extends object
  ? { [K in keyof T]?: SchemaFormatError<T[K]> }
  : unknown;

export type SchemaFormatError<T, U = string> = {
  _errors: U[];
} & recursiveSchemaFormattedError<NonNullable<T>>;
//

export class Schema<T = any> extends Error {
  issues: Schemaissue[] = [];

  get errors() {
    return this.issues;
  }

  constructor(issues: Schemaissue[]) {
    super();

    const current = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, current);
    } else {
      (this as any).__proto__ = current;
    }
    this.name = "Schemaissue";
    this.issues = issues;
  }
}
type ExampleType = {
  prop1?: string;
  prop2: number;
  prop3: string[];
};
