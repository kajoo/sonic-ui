import React from 'react';
import PropTypes from 'prop-types';

import styles from './ButtonGroup.module.scss';

class ButtonGroup extends React.PureComponent {
  static displayName = 'ButtonGroup';

  static propTypes = {
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    vertical: false,
  };

  render() {
    return (
      <ul className={styles.buttonGroup}>
        {React.Children.map(this.props.children, child => child ? (
          <li>
            {child}
          </li>
        ) : null)}
      </ul>
    );
  }
}

export default ButtonGroup;
