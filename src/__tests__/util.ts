import { GraphQLScalarType, Kind } from 'graphql';
import { isNumber, isString } from 'lodash';

export class CustomDate {
  public readonly internalDate: Date;
  constructor(x: string | number | Date) {
    this.internalDate = x instanceof Date ? x : new Date(x);
  }

  public toISOString(): string {
    return this.internalDate.toISOString();
  }

  public getNewDate(): Date {
    return new Date(this.internalDate);
  }
}

export function isSerializableDate(
  x: unknown
): x is { toISOString: () => string } {
  return x instanceof Date || x instanceof CustomDate;
}

export const StartOfDateScalar = new GraphQLScalarType<
  CustomDate | null,
  string | null
>({
  name: 'StartOfDay',
  serialize: (parsed) =>
    isSerializableDate(parsed) ? parsed.toISOString() : null,
  parseValue: (raw) => {
    if (!raw) return null;
    if (raw instanceof CustomDate) return raw;
    if (raw instanceof Date) return new CustomDate(raw.toISOString());
    if (isString(raw) || isNumber(raw)) {
      const d = new Date(raw);
      d.setUTCHours(0);
      d.setUTCMinutes(0);
      d.setUTCSeconds(0);
      d.setUTCMilliseconds(0);
      return new CustomDate(d);
    }
    throw new Error(
      `'invalid value to parse (no date, no string, no number): ${raw}'`
    );
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new CustomDate(new Date(ast.value));
    }
    return null;
  },
});

export const DateScalar = new GraphQLScalarType<Date | null, string | null>({
  name: 'Date',
  serialize: (parsed) =>
    isSerializableDate(parsed) ? parsed.toISOString() : null,
  parseValue: (raw) => {
    if (!raw) return null;
    if (raw instanceof Date) return raw;
    if (isString(raw) || isNumber(raw)) {
      return new Date(raw);
    }
    throw new Error(
      `'invalid value to parse (no date, no string, no number): ${raw}'`
    );
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});
