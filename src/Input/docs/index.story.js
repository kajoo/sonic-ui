/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import React from 'react';
import { storiesOf } from '@storybook/react';

import Input from '..';
import FormField from '../../FormField';

storiesOf('Input/Text Input', module)
  .add('normal', () => <Input />)
  .add('with FormField', () => (
    <FormField label="New Input">
      <Input />
    </FormField>
  ));
