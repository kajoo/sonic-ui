import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Heading from '../Heading';
import styles from './Notification.module.scss';

class Notification extends React.Component {
  static propTypes = {
    title: PropTypes.oneOf([
      'standard',
      'success',
      'warning',
      'error',
      'info',
    ]),
    title: PropTypes.string,
    message: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    type: 'standard',
  };

  constructor(props) {
    super(props);

    this.timer = null;

    this.hide = this.hide.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { timeout } = this.props;
    if (timeout) {
      this.timer = setTimeout(this.hide, timeout);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const {
      type,
      title,
      message,
      className,
    } = this.props;

    const classes = classNames(styles.notification, {
      [styles[`type-${type}`]]: true,
    }, className);

    return (
      <div
        className={classes}
        onClick={this.onClick}
      >
        {title && (
          <Heading appearance="H4">
            {title}
          </Heading>
        )}
        <div>
          {message}
        </div>
      </div>
    );
  }

  hide() {
    this.props.onRequestHide && this.props.onRequestHide();
  }

  onClick() {
    this.props.onClick && this.props.onClick();

    this.hide();
  }
}

export default Notification;
