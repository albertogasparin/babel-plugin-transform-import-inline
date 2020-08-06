import { NodePath, PluginObj, types as BabelTypes } from '@babel/core';
import { wrapInterop } from '@babel/helper-module-transforms';

interface ImportInfo {
  local: string;
  property: string | null;
  source: string;
}

type Imports = {
  [key: string]: ImportInfo;
};
type AffectedParents = {
  [key: string]: WeakSet<NodePath>;
};

const IGNORED_MODULES = ['react'];

export default function ({
  types: t,
}: {
  types: typeof BabelTypes;
}): PluginObj {
  const imports: Imports = {};
  const affectedParents: AffectedParents = {};

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
    path,
    programPath: NodePath<BabelTypes.Program>,
    info: ImportInfo
  ) => {
    const parentWithBody = path.findParent(
      (p) =>
        p.node !== undefined && p.node.body !== undefined && p.node.body.length
    );

    if (!affectedParents[info.local]) {
      affectedParents[info.local] = new WeakSet();
    }

    if (
      !affectedParents[info.local].has(parentWithBody) &&
      !parentWithBody.scope.hasBinding(info.local)
    ) {
      if (info.property === 'default') {
        parentWithBody.unshiftContainer(
          'body',
          createConstRequireExpression(programPath, info)
        );
      } else {
        parentWithBody.unshiftContainer(
          'body',
          createConstRequireExpression(programPath, info)
        );
      }

      affectedParents[info.local].add(parentWithBody);
    }
  };

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      ImportDeclaration(path: NodePath<BabelTypes.ImportDeclaration>) {
        const specifiers = path.node.specifiers;
        const programPath = path.parentPath;
        if (IGNORED_MODULES.includes(path.node.source.value)) {
          return;
        }

        let hasReplaced = false;
        specifiers.forEach((specifier) => {
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
        });
        if (hasReplaced) path.remove();
      },
    },
  };
}
