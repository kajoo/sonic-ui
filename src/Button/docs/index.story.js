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
// import { storySettings } from './storySettings';
// import { storiesOf } from '@storybook/react';
import { storiesOf } from '@storybook/react';
// import { Button } from '@storybook/react/demo';

import Button from '..';

storiesOf('Button/Button', module)
  .add('with text', () => <Button>Hello Button</Button>)
  .add('with emoji', () => (
    <Button>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

/*
export default {
  category: storySettings.kind,
  storyName: storySettings.storyName,
  component: Button,
  componentPath: '..',

  componentProps: {
    as: 'button',
    children: 'Button',
    size: 'medium',
  },

  exampleProps: {
    onClick: () => 'Clicked!',
    fullWidth: false,
    disabled: false,
    as: ['button', 'a', 'span', 'div'],
  },
};
*/
