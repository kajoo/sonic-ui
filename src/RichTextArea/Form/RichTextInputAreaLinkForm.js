import React from 'react';

import RichTextInputAreaForm from './RichTextInputAreaForm';
import { RichTextInputAreaContext } from '../RichTextInputAreaContext';
// import Box from '../../Box';
import Input from '../../Input';

class RichTextInputAreaLinkForm extends React.Component {
  state = {
    text: '',
    url: '',
  };

  constructor(props) {
    super(props);

    const { text = '', url = '' } = props.data;

    this.state = {
      text,
      url,
    };
  }

  render() {
    const { dataHook, onCancel } = this.props;

    return (
      <RichTextInputAreaContext.Consumer>
        {({ texts }) => (
          <RichTextInputAreaForm
            dataHook={dataHook}
            onSubmit={this._onSubmit}
            onCancel={onCancel}
            isDisabled={this.state.url.length === 0}
          >
            <div style={{ display: 'flex', marginBottom: 2 }}>
              <Input
                dataHook="richtextarea-form-link-text"
                placeholder={texts.insertionForm.link.textInputPlaceholder}
                size="small"
                value={this.state.text}
                onChange={event => this._setInputValue(event, 'text')}
              />
            </div>
            <Input
              dataHook="richtextarea-form-link-url"
              placeholder={texts.insertionForm.link.urlInputPlaceholder}
              size="small"
              value={this.state.url}
              onChange={event => this._setInputValue(event, 'url')}
            />
          </RichTextInputAreaForm>
        )}
      </RichTextInputAreaContext.Consumer>
    );
  }

  _setInputValue(event, key) {
    const {
      target: { value },
    } = event;

    this.setState({ [key]: value });
  }

  _onSubmit = event => {
    // Prevents form submission, but still enables submission when clicking `Enter`
    event.preventDefault();

    const { onSubmit } = this.props;
    const { text, url } = this.state;

    onSubmit && onSubmit(event, { text, url });
  };
}

export default RichTextInputAreaLinkForm;
