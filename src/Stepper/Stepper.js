import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Step from './Step/Step';
// import ChevronRight from '../new-icons/ChevronRight';
import { MAX_STEPS, MIN_STEPS, STEP_TYPES } from './Consts';
import styles from './Stepper.st.css';

class Stepper extends React.PureComponent {
  static displayName = 'Stepper';

  static propTypes = {
    /** Array of steps, each step should have at least text. If no type is passed, step's type is set to normal  */
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['completed', 'disabled', 'error', 'normal']),
      }),
    ),
    /** Id of the active step */
    activeStep: PropTypes.number.isRequired,
    /** Callback to be triggered on step click */
    onClick: PropTypes.func,
    className: PropTypes.string,
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    steps: [],
    onClick: activeStep => {},
  };

  constructor(props) {
    super(props);

    this._validateSteps = this._validateSteps.bind(this);
    this._validateStepType = this._validateStepType.bind(this);
    // this._validateNumberOfSteps = this._validateNumberOfSteps.bind(this);

    this._validateSteps(props.steps, props.activeStep);
  }

  componentDidUpdate() {
    this._validateNumberOfSteps(this.props.steps, this.props.activeStep);
  }

  _validateSteps(steps, activeStep) {
    this._validateStepType(steps, activeStep);
    this._validateNumberOfSteps(steps);
  }

  _validateStepType(steps, activeStep) {
    if (
      activeStep &&
      typeof activeStep === 'number' &&
      steps[activeStep].type === STEP_TYPES.DISABLED
    ) {
      console.error(
        `Error: Failed prop: The prop 'steps' at [${activeStep}] is invalid. Active step can not be disabled. Falling back to 'normal' type for step[${activeStep}]`,
      );
      steps[activeStep].type = 'normal';
    }
  }

  _validateNumberOfSteps(steps) {
    if (
      !steps ||
      !steps.length ||
      steps.length < MIN_STEPS ||
      steps.length > MAX_STEPS
    ) {
      console.error(
        `Error: Failed prop: The prop 'steps' in 'Stepper' has to be an array in the size of ${MIN_STEPS} to ${MAX_STEPS}.`,
      );
    }
  }

  render() {
    const { steps, activeStep, onClick, dataHook } = this.props;

    const classes = classNames(styles.root);

    return (
      <div
        className={classes}
        {...styles('root', {}, this.props)}
        data-hook={dataHook}
      >
        {steps.map((step, idx) => {
          const isLastStep = idx === steps.length - 1;
          const containerClasses = classNames(styles.stepContainer, {
            [styles.selected]: idx === activeStep,
          });

          return [
            <div
              key="stepContainer"
              className={containerClasses}
              {...styles(
                'stepContainer',
                { selected: idx === activeStep },
                this.props,
              )}
            >
              <Step
                id={idx}
                {...step}
                active={idx === activeStep}
                onClick={onClick}
              />
            </div>,
            !isLastStep && this._renderStepSplitter(idx),
          ];
        })}
      </div>
    );
  }
}

export default Stepper;
