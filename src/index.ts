import { NodePath, PluginObj, types as BabelTypes } from '@babel/core';
// @ts-expect-error missing typedef
import { wrapInterop } from '@babel/helper-module-transforms';

interface ImportInfo {
  local: string;
  property: string | null;
  source: string;
}

type AffectedParents = Map<
  string,
  WeakSet<NodePath<BabelTypes.Function | BabelTypes.Program>>
>;

const IGNORED_MODULES = ['react'];

export default function ({
  types: t,
}: {
  types: typeof BabelTypes;
}): PluginObj {
  const affectedParents: AffectedParents = new Map();

  const createRequireExpression = (
    programPath: NodePath<BabelTypes.Program>,
    info: ImportInfo
  ) => {
    const requireExpression = t.callExpression(t.identifier('require'), [
      t.stringLiteral(info.source),
    ]);

    if (info.property === null) {
      return wrapInterop(programPath, requireExpression, 'namespace');
    }

    return t.memberExpression(
      info.property === 'default'
        ? wrapInterop(programPath, requireExpression, 'default')
        : requireExpression,
      t.identifier(info.property)
    );
  };

  const createConstRequireExpression = (
    programPath: NodePath<BabelTypes.Program>,
    info: ImportInfo
  ) =>
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(info.local),
        createRequireExpression(programPath, info)
      ),
    ]);

  const insertDeclaration = (
    path: NodePath<BabelTypes.Node>,
    programPath: NodePath<BabelTypes.Program>,
    info: ImportInfo
  ) => {
    let parentWithBody = path.findParent(
      (p: NodePath<any>) =>
        (p.node?.body?.length && p.node?.type !== 'ClassBody') ||
        (p.node?.type === 'ArrowFunctionExpression' &&
          p.node?.body?.type !== 'BlockStatement')
    ) as NodePath<BabelTypes.Function | BabelTypes.Program>;

    const isSimpleArrowFunction =
      parentWithBody.node?.type === 'ArrowFunctionExpression' &&
      parentWithBody.node?.body?.type !== 'BlockStatement';

    if (
      parentWithBody.node?.type === 'ArrowFunctionExpression' &&
      parentWithBody.node?.body?.type !== 'BlockStatement'
    ) {
      const expression = parentWithBody.node.body;
      const newFunction = t.arrowFunctionExpression(
        parentWithBody.node.params,
        t.blockStatement([t.returnStatement(expression)])
      );
      parentWithBody.replaceWith(newFunction);
    }

    if (!affectedParents.has(info.local)) {
      affectedParents.set(info.local, new WeakSet());
    }

    if (
      !affectedParents.get(info.local)?.has(parentWithBody) &&
      !parentWithBody.scope.hasBinding(info.local, true)
    ) {
      if (isSimpleArrowFunction) {
        parentWithBody.scope.push({
          id: t.identifier(info.local),
          init: createRequireExpression(programPath, info),
        });
      } else {
        const parentInsideBody = path.findParent(
          (p: NodePath<any>) => p.parentPath === parentWithBody
        );
        parentInsideBody.insertBefore(
          createConstRequireExpression(programPath, info)
        );
      }

      affectedParents.get(info.local)?.add(parentWithBody);
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      ImportDeclaration(path: NodePath<BabelTypes.ImportDeclaration>) {
        if (IGNORED_MODULES.includes(path.node.source.value)) return;
        if (path.node.importKind === 'type') return;

        const specifiers = path.node.specifiers;
        const programPath = path.parentPath as NodePath<BabelTypes.Program>;

        let hasReplaced = false;

        const remainingSpecifiers = specifiers.filter((specifier) => {
          const info: ImportInfo =
            specifier.type === 'ImportDefaultSpecifier'
              ? {
                  local: specifier.local.name,
                  property: 'default',
                  source: path.node.source.value,
                }
              : specifier.type === 'ImportSpecifier'
              ? {
                  local: specifier.local.name,
                  property: specifier.imported.name,
                  source: path.node.source.value,
                }
              : {
                  local: specifier.local.name,
                  property: null,
                  source: path.node.source.value,
                };

          const binding = path.scope.getBinding(info.local);
          if (!binding) {
            return true;
          }

          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.importKind === 'type'
          )
            return true;

          path.scope.rename(
            info.local,
            `____________${info.local}____________`
          );

          binding.referencePaths.forEach((referencePath) => {
            insertDeclaration(referencePath, programPath, info);
            hasReplaced = true;
          });
          path.scope.rename(
            `____________${info.local}____________`,
            info.local
          );
          return !hasReplaced;
        });

        if (remainingSpecifiers.length === 0) {
          path.remove();
        } else {
          path.node.specifiers = remainingSpecifiers;
        }
      },
    },
  };
}
