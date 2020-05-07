import React from 'react';
import PropTypes from 'prop-types';

import styles from './Group.module.scss';
import { InputContext } from '../InputContext';

const Group = ({ children }) => (
  <InputContext.Consumer>
    {() => <div className={styles.root}>{children}</div>}
  </InputContext.Consumer>
);

Group.displayName = 'Input.Group';
Group.propTypes = {
  children: PropTypes.node,
};

export default Group;
