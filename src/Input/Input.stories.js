import React from 'react';
import Input from './ThemedInput';

export default {
  title: 'Input',
  component: Input,
  argTypes: {
  },
};

export const Primary = (args) => <Input {...args} />;
Primary.args = {
  value: '',
};
