/**
 * Copyright (c) Kajoo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import Color from 'color';

const DARKEN = 0.1;

export default function(theme, props = {}, state = {}) {
  if (props.disableTheme) {
    return {};
  }

  const style = {};

  if (props.color) {
    style.backgroundColor = props.color;

    if (state.hovered) {
      style.backgroundColor = Color(props.color)
        .darken(DARKEN)
        .string();
    }
  } else if (theme && theme.button.primaryColor) {
    let color;

    switch (props.theme) {
      case 'primary': {
        color = theme.button.primaryColor;
        break;
      }
      case 'warning': {
        color = theme.button.warningColor;
        break;
      }
      case 'danger': {
        color = theme.button.dangerColor;
        break;
      }
      default: {
        color = 'black';
      }
    }

    style.backgroundColor = color;

    if (state.hovered) {
      style.backgroundColor = Color(color)
        .darken(DARKEN)
        .string();
    }
  } else if (theme && theme.general.primaryColor) {
    style.backgroundColor = theme.general.primaryColor;

    if (state.hovered) {
      style.backgroundColor = Color(theme.general.primaryColor)
        .darken(DARKEN)
        .string();
    }
  }

  return style;
}
