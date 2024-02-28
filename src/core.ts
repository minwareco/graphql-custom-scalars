import {
  ASTNode,
  ExecutionResult,
  FieldNode,
  OperationDefinitionNode,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  isListType,
  isNonNullType,
  isScalarType,
  Kind,
  TypeInfo,
  visit,
  visitWithTypeInfo,
  isInputType,
} from 'graphql';
import {
  DocumentNode,
  FragmentDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  TypeNode,
  isNode,
} from 'graphql/language/ast';
import { memoize } from 'lodash';
import { mapIfArray } from './mapIfArray';
import Serializer from './serializer';

interface BaseNodeInQuery {
  /**
   * The name of the fragment if the field appeared inside of a fragment
   */
  fragmentName?: string;
  /**
   * The name of the node
   */
  name: string;
  /**
   * The path to the node in the data returned from the server
   */
  path: PropertyKey[];
}
interface ScalarInQuery extends BaseNodeInQuery {
  kind: 'Scalar';
}

interface FragmentSpreadInQuery extends BaseNodeInQuery {
  kind: 'FragmentSpread';
}

function makeIsAstNodeOfKind<T extends ASTNode>(kind: ASTNode['kind']) {
  return (
    maybeNodeOrArray: ASTNode | ReadonlyArray<ASTNode>
  ): maybeNodeOrArray is T => {
    if (!isNode(maybeNodeOrArray)) {
      return false;
    }

    return maybeNodeOrArray.kind === kind;
  };
}

const isFieldNode = makeIsAstNodeOfKind<FieldNode>(Kind.FIELD);
const isFragmentDefinition = makeIsAstNodeOfKind<FragmentDefinitionNode>(
  Kind.FRAGMENT_DEFINITION
);
const isOperationDefinitionNode = makeIsAstNodeOfKind<OperationDefinitionNode>(
  Kind.OPERATION_DEFINITION
);
const isNonNullTypeNode = makeIsAstNodeOfKind<NonNullTypeNode>(
  Kind.NON_NULL_TYPE
);
const isListTypeNode = makeIsAstNodeOfKind<ListTypeNode>(Kind.LIST_TYPE);

function mapScalar(
  data: any,
  path: PropertyKey[],
  scalarType: Pick<GraphQLScalarType, 'parseValue'>
) {
  if (data == null) {
    return data;
  }

  const newData = { ...data };

  let newSubData = newData;
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    if (Array.isArray(newSubData[segment])) {
      const subPath = path.slice(index + 1);
      newSubData[segment] = newSubData[segment].map((subData: unknown) =>
        mapScalar(subData, subPath, scalarType)
      );
      return newData;
    }
    if (newSubData[segment] === null || newSubData[segment] === undefined) {
      return newData;
    }
    newSubData[segment] = { ...newSubData[segment] };

    newSubData = newSubData[segment];
  }

  const finalSegment = path[path.length - 1];

  if (Array.isArray(newSubData[finalSegment])) {
    newSubData[finalSegment] = newSubData[finalSegment].map((item: any) =>
      scalarType.parseValue(item)
    );
  } else if (newSubData[finalSegment] != null) {
    newSubData[finalSegment] = scalarType.parseValue(newSubData[finalSegment]);
  }

  return newData;
}

export interface Operation {
  query: DocumentNode;
  variables: Record<string, any> | undefined | void;
}

function unpackTypeInner(type: GraphQLOutputType): GraphQLOutputType | void {
  if (isListType(type) || isNonNullType(type)) {
    return unpackTypeInner(type.ofType);
  }

  if (isScalarType(type)) {
    return type;
  }
}

function unpackType(type: GraphQLOutputType): GraphQLScalarType | void {
  return unpackTypeInner(type) as GraphQLScalarType | void;
}

export class CustomScalarResolver {
  private schema: GraphQLSchema;
  private scalars: Record<string, GraphQLScalarType<any, any>>;
  private typeInfoInstance: TypeInfo;
  private serializer: Serializer;
  constructor(
    schema: GraphQLSchema,
    scalars: Record<string, GraphQLScalarType<any, any>> = {}
  ) {
    this.schema = schema;
    this.scalars = scalars;
    this.typeInfoInstance = new TypeInfo(this.schema);
    this.serializer = new Serializer(this.schema, this.scalars);
  }

  /**
   * Return a graphql AST visitor that will find the nodes that are scalars or fragments.
   * nodesOfInterest will contain partial path arrays for each node that we can use to
   * reconstruct the full path to a scalar
   */
  private makeVisitor(
    nodesOfInterest: Array<ScalarInQuery | FragmentSpreadInQuery>
  ) {
    return visitWithTypeInfo(this.typeInfoInstance, {
      Field: (_node, _key, _parent, astPath, anchestorAstNodes) => {
        const fieldType = this.typeInfoInstance.getType();
        if (fieldType == null) {
          return;
        }

        const scalarType = unpackType(fieldType);
        if (scalarType == null) {
          return;
        }

        const { name } = scalarType;

        if (!(name in this.scalars)) {
          return;
        }

        let currentAstNode: ASTNode | ReadonlyArray<ASTNode> =
          anchestorAstNodes[0];

        const path: PropertyKey[] = [];
        let fragmentName: string | undefined;
        for (const segment of astPath) {
          // @ts-expect-error
          currentAstNode = currentAstNode[segment];
          if (isFieldNode(currentAstNode)) {
            const fieldNode = currentAstNode as FieldNode;
            if (fieldNode.alias) {
              path.push(fieldNode.alias.value);
            } else {
              path.push(fieldNode.name.value);
            }
          } else if (isFragmentDefinition(currentAstNode)) {
            fragmentName = currentAstNode.name.value;
          }
        }

        nodesOfInterest.push({
          fragmentName,
          kind: 'Scalar',
          name,
          path,
        });
      },
      FragmentSpread: (node, _key, _parent, astPath, anchestorAstNodes) => {
        let currentAstNode: ASTNode | ReadonlyArray<ASTNode> =
          anchestorAstNodes[0];

        const path: PropertyKey[] = [];
        let fragmentName: string | undefined;
        for (const segment of astPath) {
          // @ts-expect-error
          currentAstNode = currentAstNode[segment];
          if (isFieldNode(currentAstNode)) {
            const fieldNode = currentAstNode as FieldNode;
            if (fieldNode.alias) {
              path.push(fieldNode.alias.value);
            } else {
              path.push(fieldNode.name.value);
            }
          } else if (isFragmentDefinition(currentAstNode)) {
            fragmentName = currentAstNode.name.value;
          }
        }

        nodesOfInterest.push({
          fragmentName,
          kind: 'FragmentSpread',
          name: node.name.value,
          path,
        });
      },
    });
  }

  private visitOperation = memoize((operation: Operation) => {
    const nodesOfInterest: Array<FragmentSpreadInQuery | ScalarInQuery> = [];
    visit(operation.query, this.makeVisitor(nodesOfInterest));
    return nodesOfInterest;
  });

  private getPathsToScalars = memoize((operation: Operation) => {
    const nodesOfInterest = this.visitOperation(operation);
    const spreadFragmentsInQuery: Record<string, FragmentSpreadInQuery[]> = {};
    const scalarsInQuery: ScalarInQuery[] = [];

    for (const nodeOfInterest of nodesOfInterest) {
      const { kind } = nodeOfInterest;
      if (kind === 'Scalar') {
        scalarsInQuery.push(nodeOfInterest as ScalarInQuery);
      } else {
        const { name } = nodeOfInterest;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        spreadFragmentsInQuery[name] ??= [];
        spreadFragmentsInQuery[name].push(
          nodeOfInterest as FragmentSpreadInQuery
        );
      }
    }

    /**
     * Take a fragment found spread and recursively expands the path if the fragment is found in
     * another fragment spread
     */
    const generatePaths = (
      fragment: FragmentSpreadInQuery,
      pathParts: PropertyKey[][]
    ): PropertyKey[][] => {
      const { path: pathFragment, fragmentName } = fragment;
      return pathParts.flatMap((path) => {
        if (fragmentName && fragmentName in spreadFragmentsInQuery) {
          return spreadFragmentsInQuery[fragmentName].flatMap(
            (parentFragment) =>
              generatePaths(parentFragment, [[...pathFragment, ...path]])
          );
        }
        return [[...pathFragment, ...path]];
      });
    };

    /**
     * For each scalar reference found in the query, return a tuple of the path array and the scalar
     */
    return scalarsInQuery.flatMap(({ fragmentName, name, path }) => {
      if (fragmentName && fragmentName in spreadFragmentsInQuery) {
        const paths = spreadFragmentsInQuery[fragmentName].flatMap((fragment) =>
          generatePaths(fragment, [path])
        );
        return paths.map(
          (completePath) => [completePath, this.scalars[name]] as const
        );
      }
      return [[path, this.scalars[name]] as const];
    });
  });

  public mapResults<Op extends Operation, Results extends ExecutionResult>(
    operation: Op,
    data: Results
  ) {
    if (!data.data) {
      return data;
    }

    const pathToScalars = this.getPathsToScalars(operation);

    if (pathToScalars.length === 0) {
      return data;
    }

    for (const [path, scalar] of pathToScalars) {
      data.data = mapScalar(data.data, path, scalar);
    }

    return data;
  }

  private serializeVariable(value: any, typeNode: TypeNode): any {
    if (isNonNullTypeNode(typeNode)) {
      return this.serializeVariable(value, typeNode.type);
    }

    if (isListTypeNode(typeNode)) {
      return mapIfArray(value, (v) => this.serializeVariable(v, typeNode.type));
    }

    return this.serializeNamed(value, typeNode);
  }

  private serializeNamed(value: any, typeNode: NamedTypeNode): any {
    const typeName = typeNode.name.value;
    const schemaType = this.schema.getType(typeName);

    return schemaType && isInputType(schemaType)
      ? this.serializer.serialize(value, schemaType)
      : value;
  }

  public mapVariables<Op extends Operation>(operation: Op) {
    const operationNode = operation.query.definitions.find(
      isOperationDefinitionNode
    );
    const variableDefs = operationNode?.variableDefinitions ?? [];
    if (operation.variables !== undefined) {
      variableDefs.forEach((def) => {
        const key = def.variable.name.value;
        operation.variables![key] = this.serializeVariable(
          operation.variables![key],
          def.type
        );
      });
    }
    return operation;
  }
}
