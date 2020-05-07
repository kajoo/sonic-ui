import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import NotificationManager from './NotificationManager';
import FloatingNotification from '../Notification';
import styles from './NotificationContainer.module.scss';

class NotificationContainer extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['global', 'local', 'sticky']),
    enterTimeout: PropTypes.number,
    leaveTimeout: PropTypes.number,
    className: PropTypes.string,
    notificationElement: PropTypes.element,
  };

  static defaultProps = {
    type: 'global',
    enterTimeout: 400,
    leaveTimeout: 400,
    notificationElement: <FloatingNotification />,
    defaultTimeout: 5000,
  };

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
    };

    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
  }

  componentWillMount() {
    NotificationManager.addChangeListener(this.handleStoreChange);
  }

  componentWillUnmount() {
    NotificationManager.removeChangeListener(this.handleStoreChange);
  }

  render() {
    const {
      type,
      // enterTimeout,
      // leaveTimeout,
      notificationElement,
      defaultTimeout,
      className,
      style,
    } = this.props;
    const { notifications } = this.state;

    const classes = classNames(styles.container, {
      [styles[type]]: true,
    }, className);

    return (
      <div className={classes} style={style}>
        <TransitionGroup
        >
          {notifications.map((notification) => {
            const key = notification.id || (new Date()).getTime();
            return (
              <CSSTransition
                key={key}
                classNames={classNames(styles.notification, {
                  enter: styles.notificationEnter,
                  enterActive: styles.notificationEnterActive,
                  exit: styles.notificationExit,
                  exitActive: styles.notificationExitActive,
                })}
                timeout={notification.timeout || defaultTimeout}
              >
                {React.cloneElement(notificationElement, {
                  ...notification,
                  onRequestHide: () => this.handleRequestHide(notification),
                })}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }

  handleStoreChange(notifications) {
    this.setState({ notifications });
  }

  handleRequestHide(notification) {
    NotificationManager.remove(notification);
  }
}

export default NotificationContainer;
