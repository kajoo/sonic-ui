/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import mapValues from 'lodash/mapValues';
import { EditorState, Editor, CompositeDecorator } from 'draft-js';
import { convertFromHTML } from 'draft-convert';

import styles from './RichTextArea.module.scss';
import RichTextToolbar from './Toolbar/RichTextToolbar';
import EditorUtilities from './EditorUtilities';
import { RichTextInputAreaContext } from './RichTextInputAreaContext';
import { defaultTexts } from './RichTextInputAreaTexts';

const decorator = new CompositeDecorator([
  {
    strategy: EditorUtilities.findLinkEntities,
    component: ({ contentState, entityKey, children }) => {
      const { url } = contentState.getEntity(entityKey).getData();

      return (
        <a
          data-hook="richtextarea-link"
          href={url}
          className={styles.link}
          target="_blank"
          // Avoids a potentially serious vulnerability for '_blank' links
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
]);

class RichTextArea extends React.PureComponent {
  static displayName = 'RichTextArea';
  static errorStatus = 'error';

  static propTypes = {
    /** Initial value to display in the editor */
    initialValue: PropTypes.string,

    /** Placeholder to display */
    placeholder: PropTypes.string,

    /** Defines a maximum height for the editor (it grows by default) */
    maxHeight: PropTypes.string,

    /** Disables the editor and toolbar */
    disabled: PropTypes.bool,

    /** Texts to be shown */
    texts: PropTypes.shape({
      toolbarButtons: PropTypes.shape(
        mapValues(defaultTexts.toolbarButtons, () => PropTypes.string),
      ),
      insertionForm: PropTypes.shape({
        ...mapValues(defaultTexts.insertionForm, () => PropTypes.string),
        link: PropTypes.shape(
          mapValues(defaultTexts.toolbarButtons.link, () => PropTypes.string),
        ),
      }),
    }),

    /** Displays a status indicator */
    status: PropTypes.oneOf(['error']),

    /** Text to be shown within the tooltip of the status indicator */
    statusMessage: PropTypes.string,

    /** Callback function for changes */
    onChange: PropTypes.func,

    /** A single CSS class name to be appended to ther RichTextArea's wrapper element. */
    className: PropTypes.string,
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    initialValue: '<p></p>',
    texts: {},
  };

  constructor(props) {
    super(props);

    const { texts: consumerTexts } = props;

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      texts: {
        toolbarButtons: {
          ...defaultTexts.toolbarButtons,
          ...consumerTexts.toolbarButtons,
        },
        insertionForm: {
          ...defaultTexts.insertionForm,
          ...consumerTexts.insertionForm,
        },
      },
    };

    this.setValue = this.setValue.bind(this);

    this._setEditorState = this._setEditorState.bind(this);
    this._updateContentByValue = this._updateContentByValue.bind(this);
  }

  componentDidMount() {
    const { initialValue } = this.props;

    // TODO: currently it treats the value as an initial value
    this._updateContentByValue(initialValue);
  }

  render() {
    const {
      placeholder,
      disabled,
      maxHeight,
      status,
      className,
      dataHook,
    } = this.props;
    const isEditorEmpty = EditorUtilities.isEditorEmpty(this.state.editorState);
    const hasError = !disabled && status === RichTextArea.errorStatus;

    const classes = classNames(
      styles.root,
      {
        [styles.hidePlaceholder]: !isEditorEmpty,
        [styles.disabled]: disabled,
        [styles.error]: hasError,
      },
      className,
    );

    return (
      <div
        className={classes}
        // Using CSS variable instead of applying maxHeight on each child, down to the editor's content
        style={{ '--max-height': maxHeight }}
        data-hook={dataHook}
      >
        <RichTextInputAreaContext.Provider
          value={{
            texts: this.state.texts,
          }}
        >
          <RichTextToolbar
            isDisabled={disabled}
            editorState={this.state.editorState}
            onBold={this._setEditorState}
            onItalic={this._setEditorState}
            onUnderline={this._setEditorState}
            onLink={newEditorState => {
              this._setEditorState(newEditorState, () =>
                this.editor.focus(),
              );
            }}
            onBulletedList={this._setEditorState}
            onNumberedList={this._setEditorState}
            className={styles.toolbar}
            dataHook="richtextarea-toolbar"
          />
        </RichTextInputAreaContext.Provider>
        <div className={styles.editorWrapper}>
          <Editor
            ref={editor => (this.editor = editor)}
            editorState={this.state.editorState}
            onChange={this._setEditorState}
            placeholder={placeholder}
            readOnly={disabled}
          />
          {hasError && <span className={styles.errorIndicator}>Error</span>}
        </div>
      </div>
    );
  }

  /** Set value to display in the editor */
  setValue(value) {
    this._updateContentByValue(value);
  }

  _setEditorState(newEditorState, onStateChanged = () => {}) {
    this.setState({ editorState: newEditorState }, () => {
      const { onChange = () => {} } = this.props;
      const htmlText = EditorUtilities.convertToHtml(newEditorState);
      const plainText = newEditorState.getCurrentContent().getPlainText();

      // Invoking the external `onChange` callback with the converted HTML value
      onChange(htmlText, { plainText });
      onStateChanged();
    });
  }

  _updateContentByValue(value) {
    const content = convertFromHTML({
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a') {
          return createEntity('LINK', 'MUTABLE', { url: node.href });
        }
      },
    })(value);

    const updatedEditorState = EditorState.push(
      this.state.editorState,
      content,
    );
    this.setState({ editorState: updatedEditorState });
  }
}

export default RichTextArea;
