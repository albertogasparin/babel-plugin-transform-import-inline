const withHoc = require('with-hoc').withHoc;
const Foo = require('./foo').Foo;

import React, { Component } from 'react';
export const Bar = withHoc(Foo);
