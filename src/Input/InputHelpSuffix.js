import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../Tooltip';
// import InfoCircle from '../new-icons/InfoCircle';
import styles from './Input.module.scss';

class InputHelpSuffix extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(['normal', 'paneltitle', 'material', 'amaterial']),
    helpMessage: PropTypes.string.isRequired,
    help: PropTypes.bool,
  };

  render() {
    return (
      <Tooltip
        dataHook="input-tooltip"
        disabled={this.props.helpMessage.length === 0}
        maxWidth="230px"
        placement="right"
        alignment="center"
        textAlign="left"
        hideDelay={100}
        content={this.props.helpMessage}
        overlay=""
      >
        <div className={styles.help}>
          <i className="ion ion-md-information-circle-outline" />
        </div>
      </Tooltip>
    );
  }
}

export default InputHelpSuffix;
