import { SchemaParsedType, util } from "./validador";

export const SchemaIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_date",
  "invalid_string",
  "custom",
  "invalid_arguments",
]);

export type SchemaIssueCode = keyof typeof SchemaIssueCode;

export type SchemaIssueBase = {
  path: (string | number)[];
  message?: string;
};

//
export interface SchemaInvalidTypeIssue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.invalid_type;
  expected: SchemaParsedType;
  received: SchemaParsedType;
}

export interface SchemaInvalidArgumentsIssue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.invalid_arguments;
  argumentsErorr: Error;
}

export interface SchemaCustomIsuue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.custom;
  params?: { [K: string]: any };
}

export type SchemaIssueOptionMessage =
  | SchemaCustomIsuue
  | SchemaInvalidArgumentsIssue
  | SchemaInvalidTypeIssue;

export type SchemaIssue = SchemaIssueOptionMessage & {
  break?: boolean;
  message: string;
};

export class SchemaError<T = any> extends Error {
  public issues: SchemaIssue[] = [];

  get Errors() {
    return this.issues;
  }

  constructor(issues: SchemaIssue[]) {
    super();

    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      // eslint-disable-next-line ban/ban
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
}
