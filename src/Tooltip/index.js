import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import deprecationLog from '../utils/deprecationLog';

import TooltipNew from './TooltipNext';
import TooltipOld from './Tooltip';

class Tooltip extends Component {
  static displayName = 'Tooltip';

  static propTypes = {
    upgrade: PropTypes.bool,
  };

  oldRef = null;

  componentDidMount() {
    if (!this.props.upgrade) {
      // deprecationLog(
      //   'Using "Tooltip" with current API is deprecated. In order to upgrade to the new Tooltip API just use "<Tooltip upgrade/>" and follow "7.1 Tooltip" new API docs. ',
      // );
    }
  }
  hide = props => this.oldRef.hide(props);
  show = props => this.oldRef.show(props);
  componentElements = () => this.oldRef.componentElements();
  isShown = () => this.oldRef.isShown();
  getTriggers = () => this.oldRef.getTriggers();
  renderTooltipIntoContainer = () => this.oldRef.renderTooltipIntoContainer();
  onClickOutside = e => this.oldRef.onClickOutside(e);

  render() {
    const { upgrade, ...rest } = this.props;
    const reference = ref => (this.oldRef = ref);
    return upgrade ? (
      <TooltipNew {...rest} />
    ) : (
      <TooltipOld {...rest} ref={reference} />
    );
  }
}

export default Tooltip;
