import { SchemaIssue, ZodErrorMap } from "./erros";
import { SchemaParsedType, util } from "./validador";

export interface ParseContext {
  readonly common: {
    readonly issues: SchemaIssue[];
    readonly contextualErrorMap?: ZodErrorMap;
    readonly async: boolean;
  };
  readonly path: (string | number)[];
  readonly schemaErrorMap?: ZodErrorMap;
  readonly parent: ParseContext | null;
  readonly data: any;
  readonly parsedType: SchemaParsedType;
}

export type ParseInput = {
  data: any;
  path: (string | number)[];
  parent: ParseContext;
};

export type ParseReturnType<T> =
  | SyncParseReturnType<T>
  | AsyncParseReturnType<T>;

export type DIRTY<T> = { status: "dirty"; value: T };
export const DIRTY = <T>(value: T): DIRTY<T> => ({ status: "dirty", value });

export type OK<T> = { status: "valid"; value: T };
export const OK = <T>(value: T): OK<T> => ({ status: "valid", value });
export type INVALID = { status: "aborted" };
export const INVALID: INVALID = Object.freeze({
  status: "aborted",
});

export type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID;
export type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>;
export interface SchemaTypeDef {
  errorMap?: ZodErrorMap;
  description?: string;
}
export abstract class SchemaType<
  Output = any,
  Def extends SchemaTypeDef = SchemaTypeDef,
  Input = Output
> {
  readonly _type!: Output;
  readonly _output!: Output;
  readonly _input!: Input;
  readonly _def!: Def;

  get description() {
    return this._def.description;
  }

  abstract _parse(input: ParseInput): ParseReturnType<Output>;
}
