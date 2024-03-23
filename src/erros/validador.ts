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
  export type NonNullable<T> = T & {};

  export type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
  export const jsonStringifyReplacer = (_: string, value: any): any => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
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
  "jsonarray",
  "json",
]);

// toma los valores los tipados
export type SchemaParsedType = keyof typeof SchemaParsedType;

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
        const containsJsonObject = data.every(
          (item) => typeof item === "object" && item !== null
        );

        return containsJsonObject
          ? SchemaParsedType.jsonarray
          : SchemaParsedType.array;
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

      if (typeof data === "object" && data !== null) {
        const values = Object.values(data);
        const allObjects = values.every(
          (value) => typeof value === "object" && value !== null
        );
        return allObjects ? SchemaParsedType.json : SchemaParsedType.object;
      }

      return SchemaParsedType.object;

    default:
      return SchemaParsedType.unknown;
  }
};

