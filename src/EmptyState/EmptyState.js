import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Heading from '../Heading';
import Text from '../Text';
import styles from './EmptyState.module.scss';

class EmptyState extends React.Component {
  static displayName = 'EmptyState';

  static propTypes = {
    /** Content for the title of the Empty State */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /** Content for the subtitle of the Empty State */
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    align: PropTypes.oneOf(['start', 'center', 'end']),

    /** Children to render below the subtitle, ideally an action of some type (Button or TextButton for instance) */
    children: PropTypes.node,
    className: PropTypes.string,
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    align: 'center',
  };

  render() {
    const {
      align,
      title,
      subtitle,
      children,
      className,
      dataHook,
    } = this.props;

    const classes = classNames(
      styles.wrapper,
      styles[`align-${align}`],
      className,
    );

    return (
      <div
        className={classes}
        data-hook={dataHook}
      >
        {title && (
          <div
            className={styles.titleContainer}
            data-hook="empty-state-title-container"
          >
            <Heading appearance="H3">{title}</Heading>
          </div>
        )}

        <div
          className={styles.subtitleContainer}
          data-hook="empty-state-subtitle-container"
        >
          <Text>{subtitle}</Text>
        </div>

        {children && (
          <div
            className={classNames(
              styles.childrenContainer,
              styles[`align-${align}`],
            )}
            data-hook="empty-state-children-container"
          >
            {children}
          </div>
        )}
      </div>
    );
  }
}

export default EmptyState;
