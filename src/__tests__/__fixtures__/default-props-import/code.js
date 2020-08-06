import { foo as fooDI } from './foo';
import { Bar as BarDI } from './bar';
import { Eager } from './eager';
import valFunc from './val-func';

export const Baz = ({
  foo = fooDI,
  Bar = BarDI,
  val = valFunc(),
  eager = <Eager />,
}) => {
  foo();
  return <Bar val={val} />;
};
