import React from 'react';
import Dropdown from './Dropdown';

export default {
  title: 'Dropdown',
  component: Dropdown,
  argTypes: {
  },
};

export const Primary = (args) => <Dropdown {...args} />;
Primary.args = {
  options: [
    { id: 1, value: 'Option 1' },
    { id: 2, value: 'Option 2' },
    { id: 3, value: 'Option 3' },
  ]
};
