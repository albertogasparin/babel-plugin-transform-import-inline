import { di } from 'react-magnetic-di';
import { foo } from 'foo';

export default function () {
  di(foo);
  foo();
}
