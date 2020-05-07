import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../Input/Input';
import styles from './EditableTitle.module.scss';

const DEFAULT_MAX_LENGTH = 100;

class EditableTitle extends React.Component {
  static displayName = 'EditableTitle';

  static propTypes = {
    /** Value - initial value to display */
    initialValue: PropTypes.string,
    /** default - value to display when empty, when clicked the input gets this value */
    defaultValue: PropTypes.string,
    /** onSubmit - invoked when done editing */
    onSubmit: PropTypes.func,
    /** length - maximum chars the input can get  */
    maxLength: PropTypes.number,
    /** autoFocus - focus element on mount  */
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    defaultValue: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      value: props.initialValue || '',
    };

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onValueSubmission = this.onValueSubmission.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) this.onFocus();
  }

  render() {
    const { maxLength, className, dataHook } = this.props;

    const classes = classNames(
      styles.root,
      {
        [styles.focus]: this.state.focus,
      },
      className,
    );

    return (
      <div
        tabIndex={0}
        onFocus={this.onFocus}
        onClick={this.onFocus}
        className={classes}
        data-hook={dataHook}
      >
        <div
          className={classNames({
            [styles.renamingInput]: this.state.focus,
            [styles.hiddenInput]: !this.state.focus,
          })}
          style={{ position: 'absolute', zIndex: 1, width: '100%' }}
          onFocus={e =>
            // input does not pass his event so we need to catch it
            e.stopPropagation()
          }
          data-hook="renaming-field"
        >
          <Input
            ref={ref => (this.input = ref)}
            className={styles.nbinput}
            autoSelect={false}
            textOverflow="clip"
            maxLength={maxLength || DEFAULT_MAX_LENGTH}
            onBlur={this.onValueSubmission}
            onEnterPressed={this.onEnterPressed}
          />
        </div>
      </div>
    );
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onFocus() {
    const value = this.state.value || this.props.defaultValue;
    const selectAll = !this.state.focus;

    this.setState({ focus: true, value }, () => {
      this.input.focus();
      selectAll && this.input.select();
    });
  }

  onValueSubmission() {
    const value = this.state.value || this.props.defaultValue;
    this.setState({ value, focus: false }, () => {
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit(value);
      }
    });
  }

  onEnterPressed() {
    this.input.blur();
  }
}

export default EditableTitle;
