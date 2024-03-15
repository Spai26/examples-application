export const arrayToEnum = <T extends string, U extends [T, ...T[]]>(
  items: U
): { [k in U[number]]: k } => {
  const obj: any = {};
  for (const item of items) {
    obj[item] = item;
  }
  return obj;
};

export type noUndefined<T> = T extends undefined ? never : T;
export type noNul<T> = T extends null ? never : T;
export type isAny<T> = 0 extends 1 & T ? true : false;
export function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): noUndefined<T[K]> {
  return obj[key] as noUndefined<T[K]>;
}
