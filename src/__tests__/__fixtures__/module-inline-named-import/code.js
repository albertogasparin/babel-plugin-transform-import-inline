import React, { Component } from 'react';
import { Foo } from './foo';
import { withHoc } from 'with-hoc';

export const Bar = withHoc(Foo);
