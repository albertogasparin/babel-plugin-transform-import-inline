import React, { Component } from 'react';

const Foo = require('./foo').Foo;

const withHoc = require('with-hoc').withHoc;

export const Bar = withHoc(Foo);
