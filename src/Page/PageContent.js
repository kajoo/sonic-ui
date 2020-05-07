import React from 'react';
import PropTypes from 'prop-types';

import styles from './Page.module.scss';

class PageContent extends React.Component {
  static displayName = 'Page.Content';

  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <div className={styles.pageContent}>{this.props.children}</div>;
  }
}

export default PageContent;
