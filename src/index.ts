import { NodePath, PluginObj, types as BabelTypes } from '@babel/core';

export default function ({
  types: t,
}: {
  types: typeof BabelTypes;
}): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<BabelTypes.ImportDeclaration>) {
        return;
      },
    },
  };
}
