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

export type Issue = {
  paths?: boolean;
  message: string;
};

export class Schema<T = any> extends Error {
  issues: Issue[] = [];

  get errors() {
    return this.issues;
  }

  constructor(issues: Issue[]) {
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
