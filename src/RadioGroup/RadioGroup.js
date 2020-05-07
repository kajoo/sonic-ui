import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import RadioButton from './RadioButton';
import styles from './RadioGroup.module.scss';

class RadioGroup extends React.Component {
  static displayName = 'RadioGroup';

  static propTypes = {
    /** Callback function when user selects a different value */
    onChange: PropTypes.func,

    /** Selected radio button value */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),

    /** the values of the disabled radio buttons */
    disabledRadios: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),

    /** Positioning of the radio bottom compared to the label */
    vAlign: PropTypes.oneOf(['center', 'top']),

    /** Make the entire control disabled */
    disabled: PropTypes.bool,

    /** Decided which type of child controls to render */
    type: PropTypes.oneOf(['default', 'button']),

    /** Display direction of the radios */
    display: PropTypes.oneOf(['vertical', 'horizontal']),

    children: PropTypes.arrayOf((propValue, key) => {
      if (propValue[key].type.displayName !== RadioButton.displayName) {
        return new Error(
          `RadioGroup: Invalid Prop children was given. Validation failed on child number ${key}`,
        );
      }
    }),

    /** Vertical spacing between radio buttons */
    spacing: PropTypes.string,

    lineHeight: PropTypes.string,

    className: PropTypes.string,
  };

  static defaultProps = {
    disabledRadios: [],
    onChange: () => {},
    value: '',
    vAlign: 'center',
    display: 'vertical',
    spacing: '12px',
    lineHeight: '24px',
    type: 'default',
  };

  constructor(props) {
    super(props);
    this.name = uniqueId('RadioGroup_');
  }

  render() {
    const {
      onChange,
      disabled,
      disabledRadios,
      value,
      vAlign,
      display,
      type,
      spacing,
      lineHeight,
      className,
    } = this.props;

    return (
      <div
        className={classNames(
          styles[display],
          {
            [styles.buttonType]: type === 'button',
          },
          className,
        )}
      >
        {React.Children.map(this.props.children, (radio, index) => (
          <RadioGroup.Radio
            dataHook={radio.props.dataHook}
            value={radio.props.value}
            name={this.name}
            onChange={onChange}
            vAlign={vAlign}
            type={type}
            disabled={
              disabled || disabledRadios.indexOf(radio.props.value) !== -1
            }
            checked={radio.props.value === value}
            style={
              display === 'vertical' && index > 0 ? { marginTop: spacing } : {}
            }
            icon={radio.props.icon}
            lineHeight={lineHeight}
            content={radio.props.content}
            className={radio.props.className}
          >
            {radio.props.children}
          </RadioGroup.Radio>
        ))}
      </div>
    );
  }
}

RadioGroup.Radio = RadioButton;

export default RadioGroup;
