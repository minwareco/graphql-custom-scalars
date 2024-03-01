import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLSchema,
  getNullableType,
  isEnumType,
  isListType,
  isNonNullType,
  isScalarType,
} from 'graphql';
import { mapIfArray } from './mapIfArray';

export default class Serializer {
  constructor(
    readonly schema: GraphQLSchema,
    readonly scalars: Record<string, GraphQLScalarType<any, any>>
  ) {}

  public serialize(value: any, type: GraphQLInputType): any {
    if (isNonNullType(type)) {
      return this.serializeInternal(value, getNullableType(type));
    } else {
      return this.serializeNullable(value, getNullableType(type));
    }
  }

  protected serializeNullable(value: any, type: GraphQLInputType): any {
    return this.serializeInternal(value, type);
  }

  protected serializeInternal(value: any, type: GraphQLInputType): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (isScalarType(type) || isEnumType(type)) {
      return this.serializeLeaf(value, type);
    }

    if (isListType(type)) {
      return mapIfArray(value, (v) => this.serialize(v, type.ofType));
    }

    return this.serializeInputObject(value, type);
  }

  protected serializeLeaf(
    value: any,
    type: GraphQLScalarType | GraphQLEnumType
  ): any {
    const fns = this.scalars[type.name] || type;
    return fns.serialize(value);
  }

  protected serializeInputObject(
    givenValue: any,
    type: GraphQLInputObjectType
  ): any {
    let value = givenValue;
    const ret: any = {};
    const fields = type.getFields();
    for (const [key, val] of Object.entries(value)) {
      const f = fields[key];
      ret[key] = f ? this.serialize(val, f.type) : val;
    }
    return ret;
  }
}
