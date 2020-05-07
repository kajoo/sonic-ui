import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as SpinnerSvg } from './spinner.svg';

import styles from './Loader.module.scss';

class Loader extends React.Component {
  static displayName = 'Loader';

  static propTypes = {
    active: PropTypes.bool,
  };

  static defaultProps = {
    active: true,
  };

  render() {
    const { active, ...props } = this.props;

    return (
      <div
        {...props}
        className={classNames(styles.container, {
          [styles.active]: active,
        })}
      >
        <SpinnerSvg
          className={styles.icon}
        />
      </div>
    );
  }
}

export default Loader;
