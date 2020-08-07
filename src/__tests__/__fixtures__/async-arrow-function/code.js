import { fetch } from './fetch';

export const fn = async () => (await fetch()).foo();
