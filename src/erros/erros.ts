import { SchemaParsedType, util } from "./validador";

export const SchemaIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_date",
  "invalid_string",
  "invalid_arguments",
  "custom",
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
  argumentsErorr: SchemaError;
}

export interface SchemaInvalidDateIssue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.invalid_date;
}

export type StringValidation =
  | "email"
  | "url"
  | "emoji"
  | "uuid"
  | "regex"
  | "cuid"
  | "cuid2"
  | "ulid"
  | "datetime"
  | "ip"
  | { includes: string; position?: number }
  | { startsWith: string }
  | { endsWith: string };
export interface SchemaInvalidStringIssue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.invalid_string;
  validation: StringValidation;
}

export interface SchemaCustomIssue extends SchemaIssueBase {
  code: typeof SchemaIssueCode.custom;
  params?: { [k: string]: any };
}
export type SchemaIssueOptionMessage =
  | SchemaInvalidArgumentsIssue
  | SchemaInvalidTypeIssue
  | SchemaInvalidDateIssue
  | SchemaInvalidStringIssue
  | SchemaCustomIssue;

export type SchemaIssue = SchemaIssueOptionMessage & {
  fatal?: boolean;
  message: string;
};

type recursiveSchemaFormattedError<T> = T extends [any, ...any[]]
  ? { [K in keyof T]?: SchemaFormattedError<T[K]> }
  : T extends any[]
  ? { [k: number]: SchemaFormattedError<T[number]> }
  : T extends object
  ? { [K in keyof T]?: SchemaFormattedError<T[K]> }
  : unknown;

export type SchemaFormattedError<T, U = string> = {
  _errors: U[];
} & recursiveSchemaFormattedError<util.NonNullable<T>>;

type allKeys<T> = T extends any ? keyof T : never;

export type typeToFlattenedError<T, U = string> = {
  formErrors: U[];
  fieldErrors: {
    [P in allKeys<T>]?: U[];
  };
};

export class SchemaError<T = any> extends Error {
  public issues: SchemaIssue[] = [];

  get Errors() {
    return this.issues;
  }

  get isEmpty(): boolean {
    return this.issues.length === 0;
  }

  constructor(issues: SchemaIssue[]) {
    super();

    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      (this as any).__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }

  format(): SchemaFormattedError<T>;
  format<U>(mapper: (issue: SchemaIssue) => U): SchemaFormattedError<T, U>;
  format(_mapper?: any) {
    const mapper: (issue: SchemaIssue) => any =
      _mapper ||
      function (issue: SchemaIssue) {
        return issue.message;
      };
    const fieldErrors: SchemaFormattedError<T> = { _errors: [] } as any;
    const processError = (error: SchemaError) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_arguments") {
          processError(issue.argumentsErorr);
        } else if (issue.path.length === 0) {
          (fieldErrors as any)._errors.push(mapper(issue));
        } else {
          let curr: any = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;

            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }

            curr = curr[el];
            i++;
          }
        }
      }
    };

    processError(this);
    return fieldErrors;
  }

  static create = (issues: SchemaIssue[]) => {
    const error = new SchemaError(issues);
    return error;
  };

  toString() {
    return this.message;
  }

  getMessage() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }

  addIssue(sub: SchemaIssue) {
    this.issues = [...this.issues, sub];
  }

  addIssues(subs: SchemaIssue[]) {
    this.issues = [...this.issues, ...subs];
  }

  flatten(): typeToFlattenedError<T>;
  flatten<U>(mapper?: (issue: SchemaIssue) => U): typeToFlattenedError<T, U>;
  flatten<U = string>(
    mapper: (issue: SchemaIssue) => U = (issue: SchemaIssue) =>
      issue.message as any
  ): any {
    const fieldErrors: any = {};
    const formErrors: U[] = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }

  get formErrors() {
    return this.flatten();
  }
}

type stripPath<T extends object> = T extends any
  ? util.OmitKeys<T, "path">
  : never;

export type IssueData = stripPath<SchemaIssueOptionMessage> & {
  path?: (string | number)[];
  fatal?: boolean;
};

export type ErrorMapCtx = {
  defaultError: string;
  data: any;
};

export type ZodErrorMap = (
  issue: SchemaIssueOptionMessage,
  _ctx: ErrorMapCtx
) => { message: string };