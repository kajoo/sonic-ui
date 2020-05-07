import React from 'react';

import styles from './RichTextInputAreaForm.module.scss';
import { RichTextInputAreaContext } from '../RichTextInputAreaContext';
import Tooltip from '../../Tooltip';
// import Box from '../../Box';
import IconButton from '../../IconButton';
// import Check from '../../new-icons/Check';
// import X from '../../new-icons/X';

class RichTextInputAreaForm extends React.PureComponent {
  render() {
    const { dataHook, children, onSubmit, onCancel, isDisabled } = this.props;

    return (
      <RichTextInputAreaContext.Consumer>
        {({ texts }) => (
          <form data-hook={dataHook} onSubmit={onSubmit}>
            {children}
            <div className={styles.footer}>
              <Tooltip
                content={texts.insertionForm.cancelButtonLabel}
                theme="dark"
                appendToParent
              >
                <IconButton
                  dataHook="richtextarea-form-cancel-button"
                  action="secondary"
                  size="small"
                  onClick={onCancel}
                >
                  {/*
                  <X />
                  */}
                  <i className="fas fa-times" />
                </IconButton>
              </Tooltip>
              {/*
              <Box inline marginLeft={1}>
                <Tooltip
                  content={texts.insertionForm.confirmButtonLabel}
                  theme="dark"
                  appendToParent
                >
                  <IconButton
                    dataHook="richtextarea-form-confirm-button"
                    type="submit"
                    size="small"
                    onClick={onSubmit}
                    disabled={isDisabled}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>
              </Box>
              */}
            </div>
          </form>
        )}
      </RichTextInputAreaContext.Consumer>
    );
  }
}

export default RichTextInputAreaForm;
