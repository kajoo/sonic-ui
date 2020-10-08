import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Heading from '../Heading';
import Text from '../Text';
import styles from './Page.module.scss';

class PageHeader extends React.Component {
  static displayName = 'Page.Header';

  static propTypes = {
    /** The main title text */
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** The subtitle text */
    subtitle: PropTypes.node,
    /** A placeholder for a component that can contain actions / anything else. It should be a React component that receives `minimized` and `hasBackgroundImage` props. */
    actionsBar: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /** A css class to be applied to the component's root element */
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.renderTitle = this.renderTitle.bind(this);
  }

  render() {
    const { actions, className, dataHook } = this.props;

    return (
      <div className={styles.headerContainer}>
        <div className={classNames(styles.pageHeader, className)}>
          {this.renderHeading()}

          <div className={styles.actions}>
            {typeof actions === 'function' ? actions() : actions}
          </div>
        </div>
      </div>
    );
  }

  renderHeading() {
    // TODO: add back button support
    return <div className={styles.heading}>{this.renderTitle()}</div>;
  }

  renderTitle() {
    const { title, subtitle, titleComponent } = this.props;

    if (titleComponent) {
      return titleComponent;
    }

    return (
      <div className={styles.titleColumn}>
        <Heading ellipsis={typeof title === 'string'}>{title}</Heading>

        <Text ellipsis={typeof subtitle === 'string'}>{subtitle}</Text>
      </div>
    );
  }
}

export default PageHeader;
