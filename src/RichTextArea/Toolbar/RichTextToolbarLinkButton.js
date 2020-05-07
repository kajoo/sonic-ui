import React from 'react';

import RichTextToolbarButton from './RichTextToolbarButton';
import RichTextInputAreaLinkForm from '../Form/RichTextInputAreaLinkForm';
// import Popover from '../../Popover';
// import Box from '../../Box';

class RichTextToolbarLinkButton extends React.Component {
  state = {
    isFormShown: false,
  };

  render() {
    const {
      dataHook,
      tooltipText,
      isDisabled,
      isActive,
      children,
      data,
    } = this.props;
    const { isFormShown } = this.state;
    const { selectedText } = data;

    return (
      <div style={{ padding: 3 }}>
        <RichTextInputAreaLinkForm
          dataHook="richtextarea-form"
          onSubmit={this._onSubmit}
          onCancel={this._onHide}
          data={{ text: selectedText }}
        />
      </div>
    );

    /*
    return (
      <Popover
        appendTo="parent"
        placement="bottom"
        showArrow
        animate
        shown={isFormShown}
        onClickOutside={this._onHide}
      >
        <Popover.Element>
          <RichTextToolbarButton
            dataHook={dataHook}
            onClick={this._onButtonClick}
            tooltipText={tooltipText}
            isDisabled={isDisabled}
            isActive={isActive || this.state.isFormShown}
          >
            {children}
          </RichTextToolbarButton>
        </Popover.Element>
        <Popover.Content>
          <div style={{ display: 'flex', padding: 3 }}>
            <RichTextInputAreaLinkForm
              dataHook="richtextarea-form"
              onSubmit={this._onSubmit}
              onCancel={this._onHide}
              data={{ text: selectedText }}
            />
          </div>
        </Popover.Content>
      </Popover>
    );
    */
  }

  /*
  When clicking the button, one of the following occurs:
  1. If the selected text does not contain a link, it will show the link insertion form
  2. If the selected text contains a link, it will detach that link from the text
  */
  _onButtonClick = () => {
    const { onRemove, data } = this.props;
    const { hasRemovableEntityInSelection } = data;

    // Checks if the selected text does not contain a link
    if (!hasRemovableEntityInSelection) {
      this.setState({ isFormShown: true });
    } else {
      onRemove();
    }
  };

  _onSubmit = (event, linkData) => {
    const { onSubmit } = this.props;

    onSubmit(event, linkData);
    this._onHide();
  };

  _onHide = () => {
    this.setState({ isFormShown: false });
  };
}

export default RichTextToolbarLinkButton;
