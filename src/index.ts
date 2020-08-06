import { NodePath, PluginObj, types as BabelTypes } from '@babel/core';
import jestConfig from '../jest.config';

interface ImportInfo {
  local: string;
  property: string;
  source: string;
}

type Imports = {
  [key: string]: ImportInfo;
};

const IGNORED_MODULES = ['react'];

export default function ({
  types: t,
}: {
  types: typeof BabelTypes;
}): PluginObj {
  const imports: Imports = {};

  const createRequireExpression = (info: ImportInfo) =>
    t.memberExpression(
      t.callExpression(t.identifier('require'), [t.stringLiteral(info.source)]),
      t.identifier(info.property)
    );

  const createConstRequireExpression = (info: ImportInfo) =>
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(info.local),
        createRequireExpression(info)
      ),
    ]);

  const insertDeclaration = (path, info) => {
    const parentWithBody = path.findParent(
      (p) => p.node !== undefined && p.node.body !== undefined
    );

    if (!parentWithBody.scope.hasBinding(info.local)) {
      parentWithBody.unshiftContainer(
        'body',
        createConstRequireExpression(info)
      );
    }
  };

  return {
    visitor: {
      ImportDeclaration(path: NodePath<BabelTypes.ImportDeclaration>) {
        const specifiers = path.node.specifiers;

        if (IGNORED_MODULES.includes(path.node.source.value)) {
          return;
        }

        specifiers.forEach((specifier) => {
          if (specifier.type === 'ImportDefaultSpecifier') {
            const info = {
              local: specifier.local.name,
              property: 'default',
              source: path.node.source.value,
            };
            imports[info.local] = info;
          } else if (specifier.type === 'ImportSpecifier') {
            const info = {
              local: specifier.local.name,
              property: specifier.imported.name,
              source: path.node.source.value,
            };
            imports[info.local] = info;
          }
        });
        path.remove();
      },
      CallExpression(path) {
        if (path.node.callee.type === 'Identifier') {
          const { name } = path.node.callee;
          if (imports[name]) {
            insertDeclaration(path, imports[name]);
          }
        }
      },
      JSXIdentifier(path) {
        const { name } = path.node;
        if (imports[name]) {
          insertDeclaration(path, imports[name]);
        }
      },
      AssignmentPattern(path) {
        const { right } = path.node;

        if (right.type === 'Identifier') {
          const matchedImport = Object.keys(imports).find((key) => {
            return imports[key].local === right.name;
          });

          if (matchedImport && imports[matchedImport]) {
            path.node.right = createRequireExpression(imports[matchedImport]);
          }
        } else if (right.type === 'CallExpression') {
          const matchedImport = Object.keys(imports).find((key) => {
            if (right.callee.type === 'Identifier')
              return imports[key].local === right.callee.name;
            return false;
          });

          if (matchedImport && imports[matchedImport]) {
            right.callee = createRequireExpression(imports[matchedImport]);
          }
        } else if (right.type === 'JSXElement') {
          if (right.openingElement.name.type === 'JSXIdentifier') {
            const { name } = right.openingElement.name;
            const matchedImport = Object.keys(imports).find((key) => {
              return imports[key].local === name;
            });

            const parentScope = path.getStatementParent().scope;
            if (!parentScope.hasBinding(name)) {
              // console.log(parentScope);
              parentScope.push({
                id: t.identifier(name),
                init: createRequireExpression(imports[matchedImport]),
              });
            }
          } else if (right.openingElement.name.type === 'JSXMemberExpression') {
            let node = right.openingElement.name.object;

            while (node && node.type !== 'JSXIdentifier') {
              node = node.object;
            }

            if (!node) return;
            if (node.type !== 'JSXIdentifier') return;

            const { name } = node;
            const matchedImport = Object.keys(imports).find((key) => {
              return imports[key].local === name;
            });

            const parentScope = path.getStatementParent().scope;
            if (!parentScope.hasBinding(name)) {
              // console.log(parentScope);
              parentScope.push({
                id: t.identifier(name),
                init: createRequireExpression(imports[matchedImport]),
              });
            }
          }
        }
      },
    },
  };
}
