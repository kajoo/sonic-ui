import React from 'react';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    // children: { control: 'text' },
  },
};

export const Primary = (args) => <Button {...args} />;
Primary.args = {
  children: 'Button',
};
