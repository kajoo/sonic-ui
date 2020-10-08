import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PageHeader from './PageHeader';
import PageContent from './PageContent';
import styles from './Page.module.scss';

const allowedChildren = [PageHeader, PageContent];

class Page extends React.Component {
  static displayName = 'Page';

  static propTypes = {
    /** Accepts these components as children: `Page.Header`, `Page.Content`. Order is insignificant. */
    children: PropTypes.arrayOf((children, key) => {
      const child = children[key];
      if (!child) {
        return;
      }

      const allowedDisplayNames = allowedChildren.map(c => c.displayName);
      const childDisplayName = child.type.displayName;
      if (!allowedDisplayNames.includes(childDisplayName)) {
        return new Error(
          `Page: Invalid Prop children, unknown child ${child.type}`,
        );
      }
    }).isRequired,
    /** A css class to be applied to the component's root element */
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.hasHeader = this.hasHeader.bind(this);
  }

  render() {
    const { className } = this.props;

    const classes = classNames(styles.page, {
      [styles.hasHeader]: this.hasHeader(),
    }, className);

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }

  hasHeader() {
    let flag = false;

    React.Children.forEach(this.props.children, (child) => {
      if (child.type.displayName === PageHeader.displayName) {
        flag = true;
        return true;
      }
    });

    return flag;
  }
}

Page.Header = PageHeader;
Page.Content = PageContent;

export default Page;
