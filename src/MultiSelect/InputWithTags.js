import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isUndefined from 'lodash/isUndefined';

import Tag from '../Tag';
import Input from '../Input';
import SortableList from '../SortableList/SortableList';
import defaultDndStyles from '../dnd-styles';

import styles from './InputWithTags.module.scss';

class InputWithTags extends React.Component {
  static propTypes = {
  };

  static defaultProps = {
    placeholder: '',
    delimiters: [],
    tags: [],
    onRemoveTag: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      inputHasFocus: false,
    };

    this.renderReorderableTag = this.renderReorderableTag.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.select = this.select.bind(this);
    this.clear = this.clear.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.props.autoFocus && this.props.onFocus();
  }

  render() {
    // console.log('props', this.props);
    const {
      tags,
      onRemoveTag,
      onReorder,
      placeholder,
      status,
      statusMessage,
      disabled,
      delimiters,
      mode,
      size,
      className,
      ...inputProps
    } = this.props;
    const { inputHasFocus: hasFocus } = this.state;
    const isSelectMode = mode === 'select';

    const classes = classNames(styles.root, {
      [styles.disabled]: disabled,
      [styles.readOnly]: isSelectMode,
      [styles.hasFocus]: hasFocus && !disabled,
      [styles.hasMaxHeight]:
        !isUndefined(this.props.maxHeight) ||
        !isUndefined(this.props.maxNumRows),
      [styles[`size-${size}`]]: true,
    }, className);

    /* eslint-disable no-unused-vars */
    const {
      onManuallyInput,
      inputElement,
      closeOnSelect,
      predicate,
      onClickOutside,
      fixedHeader,
      fixedFooter,
      dataHook,
      onFocus,
      withSelection,
      onBlur,
      menuArrow,
      onInputClicked,
      ...desiredProps
    } = inputProps;
    // console.log('desiredProps', desiredProps);

    let rowMultiplier;
    if (tags.length && tags[0].size === 'large') {
      rowMultiplier = 47;
    } else {
      rowMultiplier = 35;
    }
    const maxHeight =
      this.props.maxHeight ||
      this.props.maxNumRows * rowMultiplier ||
      'initial';

    return (
      <div
        onClick={this.onClick}
        className={classes}
        style={{ maxHeight }}
        data-hook={dataHook}
      >
        {onReorder ? (
          <SortableList
            items={tags}
            onDrop={onReorder}
            renderItem={this.renderReorderableTag}
            contentClassName={styles.sortableTagsContainer}
          />
        ) : (
          tags.map(({ label, ...rest }) => (
            <Tag
              key={rest.id}
              disabled={disabled}
              onRemove={onRemoveTag}
              className={styles.tag}
              dataHook="tag"
              {...rest}
            >
              {label}
            </Tag>
          ))
        )}
        <span
          className={styles.input}
        >
          <div
            className={classNames(styles.hiddenDiv, {
              [styles.smallFont]: size === 'small',
            })}
          >
            {this.props.inputValue}
          </div>

          <Input
            ref={input => this.input = input}
            size={size}
            width={this.props.width}
            placeholder={tags.length === 0 ? placeholder : ''}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            {...desiredProps}
            disabled={disabled}
            disableEditing={isSelectMode}
            withSelection
            onChange={e => {
              if (!delimiters.includes(e.target.value)) {
                this.setState({ inputValue: e.target.value });
                desiredProps.onChange && desiredProps.onChange(e)
              }
            }}
            prefix={
              this.props.customSuffix &&
              !this.props.hideCustomSuffix &&
              !this.state.inputHasFocus && (
                <span data-hook="custom-suffix" className={styles.customSuffix}>
                  {this.props.customSuffix}
                </span>
              )
            }
            dataHook="InputWithTags-input"
          />
        </span>
      </div>
    )
  }

  renderReorderableTag({
    item: { id, label, ...itemProps },
    previewStyles,
    isPlaceholder,
    isPreview,
    ...rest
  }) {
    const { onRemoveTag, disabled } = this.props;
    const classes = classNames(styles.tag, {
      [defaultDndStyles.itemPlaceholder]: isPlaceholder,
      [styles.draggedTagPlaceholder]: isPlaceholder,
      [defaultDndStyles.itemPreview]: isPreview,
      [styles.draggedTag]: isPreview,
    });

    return (
      <div style={previewStyles}>
        <Tag
          id={id}
          dataHook="tag"
          disabled={disabled}
          className={classes}
          onRemove={onRemoveTag}
          {...itemProps}
          {...rest}
        >
          {label}
        </Tag>
      </div>
    );
  }

  onFocus(e) {
    !this.state.inputHasFocus && this.setState({ inputHasFocus: true });
    this.props.onFocus && this.props.onFocus(e);
  }

  onBlur(e) {
    this.state.inputHasFocus && this.setState({ inputHasFocus: false });
    this.props.onBlur && this.props.onBlur(e);
  }

  onClick(e) {
    if (!this.props.disabled) {
      this.input.focus();
      this.props.onInputClicked && this.props.onInputClicked(e);
    }
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  clear() {
    this.input.clear();
  }
}

export default InputWithTags;
