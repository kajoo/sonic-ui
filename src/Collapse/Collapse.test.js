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
import { mount } from 'enzyme';

import Collapse from '.';

describe('Collapse', () => {
  it('should render children', () => {
    const wrapper = mount(<Collapse>hello</Collapse>);
    expect(wrapper.text()).toEqual('hello');
  });

  describe('`open` prop', () => {
    it('should not render children when false', () => {
      const wrapper = mount(<Collapse open={false}>hello</Collapse>);
      expect(wrapper.children().text()).toEqual(null);
    });
  });

  describe('`dataHook` prop', () => {
    it('should be passed to children', () => {
      const hookForRoot = "I'm Hooked!";
      const hookOfChild = 'Leave britney alone!';

      const wrapper = mount(
        <Collapse dataHook={hookForRoot}>
          <div data-hook={hookOfChild}>arbitrary content</div>
        </Collapse>,
      );

      expect(wrapper.children().prop('data-hook')).toEqual(hookForRoot);
      expect(wrapper.find(`[data-hook="${hookOfChild}"]`).exists()).toBe(true);
    });
  });
});
