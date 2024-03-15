export namespace util {
  // convierte en un objeto donde los elementos y los valores toman el mismo valor
  export const arrayToEnum = <T extends string, U extends [T, ...T[]]>(
    items: U
  ): { [k in U[number]]: k } => {
    const obj: any = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj as any;
  };

  export type noUndefined<T> = T extends undefined ? never : T;
  export type isAny<T> = 0 extends 1 & T ? true : false;
}

// retorna un undfined independientemente de la declarion del tipado

export function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): util.noUndefined<T[K]> {
  return obj[key] as util.noUndefined<T[K]>;
}

// genero la lista de tipado
export const SchemaParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set",
]);

// toma los valores los tipados
export type SchemaParsedType = keyof typeof SchemaParsedType;

// Ejemplo de uso

export const getParseType = (data: any): SchemaParsedType => {
  const t = typeof data;

  switch (t) {
    case "undefined":
      return SchemaParsedType.undefined;
    case "string":
      return SchemaParsedType.string;

    case "number":
      return isNaN(data) ? SchemaParsedType.nan : SchemaParsedType.number;

    case "boolean":
      return SchemaParsedType.boolean;

    case "object":
      if (Array.isArray(data)) {
        return SchemaParsedType.array;
      }
      if (data === null) {
        return SchemaParsedType.null;
      }
      if (
        data.then &&
        typeof data.then === "function" &&
        data.catch &&
        typeof data.catch === "function"
      ) {
        return SchemaParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return SchemaParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return SchemaParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return SchemaParsedType.date;
      }
      return SchemaParsedType.object;

    default:
      return SchemaParsedType.unknown;
  }
};

type ValidatorFunction<T> = (value: T) => boolean;

interface ValidationResult {
  message: string;
}

type UserSchema = {
  id: ValidatorFunction<number>;
  username: ValidatorFunction<string>;
  email: ValidatorFunction<string>;
};

const isNumber: ValidatorFunction<number> = (value) => {
  return typeof value === "number" && !isNaN(value);
};

const isMinLength =
  (minLength: number): ValidatorFunction<string> =>
  (value) => {
    return typeof value === "string" && value.length >= minLength;
  };

const isEmail: ValidatorFunction<string> = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const validate = <T>(
  schema: { [K in keyof T]: ValidatorFunction<T[K]> },
  data: T
): { [K in keyof T]: ValidationResult[] } => {
  const errors: { [K in keyof T]: ValidationResult[] } = {} as any;

  for (const key in schema) {
    const validator = schema[key];
    const value = data[key];

    if (!validator(value)) {
      errors[key] = [{ message: `Invalid value: ${JSON.stringify(value)}` }];
    }
  }

  return errors;
};

const userSchema: UserSchema = {
  id: isNumber,
  username: isMinLength(3),
  email: isEmail,
};

const userData = {
  id: 123,
  username: "usd",
  email: "invalid@hotmail.com",
};

const validationErrors = validate(userSchema, userData);
console.log(validationErrors);
