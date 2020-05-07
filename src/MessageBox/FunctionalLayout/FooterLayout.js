import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../../Button';
import styles from './FooterLayout.module.scss';

const FooterLayout = ({
  bottomChildren,
  children,
  theme,
  cancelText,
  cancelPrefixIcon,
  cancelSuffixIcon,
  onCancel,
  onConfirm,
  confirmText,
  confirmPrefixIcon,
  confirmSuffixIcon,
  buttonsHeight,
  enableOk,
  enableCancel,
  sideActions,
}) => {
  const footerButtonsClassNames = classNames(styles.footerbuttons, {
    [styles.withSideActions]: sideActions && (cancelText || confirmText),
  });

  return (
    <div>
      <div className={styles.footer} data-hook="message-box-footer">
        {sideActions}
        {children}
        <div className={footerButtonsClassNames}>
          {cancelText && (
            <Button
              prefixIcon={cancelPrefixIcon}
              suffixIcon={cancelSuffixIcon}
              disabled={!enableCancel}
              height={buttonsHeight}
              theme={'empty' + theme}
              onClick={onCancel}
              children={cancelText}
              dataHook="cancellation-button"
            />
          )}
          {confirmText && (
            <Button
              prefixIcon={confirmPrefixIcon}
              suffixIcon={confirmSuffixIcon}
              disabled={!enableOk}
              height={buttonsHeight}
              theme={'full' + theme}
              onClick={onConfirm}
              children={confirmText}
              dataHook="confirmation-button"
            />
          )}
        </div>
      </div>

      {bottomChildren && (
        <div
          className={styles.bottomChildren}
          children={bottomChildren}
          data-hook="footer-layout-bottom-children"
        />
      )}
    </div>
  );
};

FooterLayout.propTypes = {
  confirmText: PropTypes.node,
  confirmPrefixIcon: PropTypes.element,
  confirmSuffixIcon: PropTypes.element,
  cancelText: PropTypes.node,
  cancelPrefixIcon: PropTypes.element,
  cancelSuffixIcon: PropTypes.element,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  enableOk: PropTypes.bool,
  enableCancel: PropTypes.bool,
  theme: PropTypes.string,
  buttonsHeight: PropTypes.string,
  children: PropTypes.any,
  bottomChildren: PropTypes.node,
  sideActions: PropTypes.node,
};

FooterLayout.defaultProps = {
  theme: 'blue',
  buttonsHeight: 'small',
  enableOk: true,
  enableCancel: true,
};

export default FooterLayout;
