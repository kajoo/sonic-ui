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
import GraphemeSplitter from 'grapheme-splitter';
import classNames from 'classnames';

import styles from './Avatar.module.scss';
import stringToColor from './string-to-color';

const splitter = new GraphemeSplitter();
const DEFAULT_CONTENT_TYPE: ContentType = 'placeholder';
function nameToInitials(name?: string, limit: 2 | 3 = 2) {
  if (!name) {
    return '';
  }

  if (limit < 2 || limit > 3) {
    limit = 2;
  }

  let initials = name.split(' ').map(s => splitter.splitGraphemes(s)[0]);

  if (limit === 2 && initials.length > 2) {
    initials = [initials[0], initials[initials.length - 1]];
  }

  if (limit === 3 && initials.length > 3) {
    initials = [initials[0], initials[1], initials[initials.length - 1]];
  }

  return initials.join('').toUpperCase();
}

class Avatar extends React.Component {
  static displayName = 'Avatar';

  static propTypes = {
    /** Avatar size */
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Background color of the avatar. When no color is provided the color is determined by the provided text or name so that each name will receive a different color. */
    color: PropTypes.string,
    /** Shape of the image, can be square or circle */
    shape: PropTypes.oneOf(['circle', 'square']),
    /** Props for an <img> tag to be rendered as content. */
    imageProps: PropTypes.object,
    /** The name of the avatar user. Text initials will be generated from the name. And it will be used as default value for html `title` and `aria-label` attributes. */
    name: PropTypes.string,
    /** Text to render as content. */
    text: PropTypes.string,
    /** Limit the number of letters in the generated initials (from name). May be 2 or 3 only. */
    initialsLimit: PropTypes.oneOf([2, 3]),
    /** HTML aria-label attribute value. To be applied on the root element */
    ariaLabel: PropTypes.string,
    /** A node with a placeholder to be rendered as content. Will be displayed if no `text`, `name` or `imgProps` are provided. */
    placeholder: PropTypes.element,
    /** HTML title attribute value. To be applied on the root element */
    title: PropTypes.string,
    /** Avatar presence. Options like 'online' mean that the conatct is online */
    presence: PropTypes.oneOf(['online', 'offline', 'busy']),
    /** classes to be applied to the root element */
    className: PropTypes.string,
    /** Applied as data-hook HTML attribute that can be used to create an Avatar driver in testing */
    dataHook: PropTypes.string,
  };

  static defaultProps = {
    shape: 'circle',
    size: 48,
    placeholder: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageLoaded: false,
    };

    this.renderContent = this.renderContent.bind(this);
    this.getCurrentContentType = this.getCurrentContentType.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.unloadImage = this.unloadImage.bind(this);
  }

  componentDidMount() {
    this.getRequestedContentType() === 'image' &&
      !this.state.imageLoaded &&
      this.loadImage();
  }

  componentDidUpdate() {
    this.getRequestedContentType() === 'image' &&
      !this.image &&
      !this.state.imageLoaded &&
      this.loadImage();
  }

  componentWillUnmount() {
    this.image && this.unloadImage();
  }

  render() {
    const {
      shape,
      size,
      color: colorProp,
      name,
      text,
      title,
      ariaLabel,
      presence,
      className,
      dataHook,
      ...props
    } = this.props;

    const classes = classNames(
      styles.root,
      {
        // [styles.circle]: shape === 'circle',
        // [styles.square]: shape !== 'circle',
      },
      className,
    );
    const color = colorProp || stringToColor(text || name);
    const style = {
      width: size + 'px',
      height: size + 'px',
      borderRadius:
        shape === 'circle' ? Math.ceil(parseInt(size, 10)) + 'px' : '6px',
      backgroundColor: color,
    };
    const contentType = this.getCurrentContentType();

    return (
      <div className={classes} style={style} data-hook={dataHook}>
        <div
          data-content-type={contentType}
          data-img-loaded={this.state.imageLoaded}
          title={title || name}
          aria-label={ariaLabel || name}
          className={styles.avatar}
        >
          {this.renderContent(contentType)}
        </div>
        {presence && (
          <div
            className={classNames(styles.presence, {
              [styles[`${presence}`]]: true,
            })}
            style={{
              height: Math.floor(size / 4) + 'px',
              width: Math.floor(size / 4) + 'px',
            }}
          />
        )}
      </div>
    );
  }

  renderContent(contentType) {
    switch (contentType) {
      case 'text': {
        const { name, text } = this.props;
        const textContent =
          text || nameToInitials(name, this.props.initialsLimit);

        return (
          <div className={styles.content} data-hook="text-container">
            {textContent}
          </div>
        );
      }

      case 'placeholder': {
        const { placeholder } = this.props;

        return placeholder === null
          ? null
          : React.cloneElement(placeholder, {
              className: classNames(
                placeholder.props.className,
                styles.content,
              ),
            });
      }

      case 'image': {
        const { alt, className, ...props } = this.props.imageProps;

        return (
          <img
            className={classNames(styles.content, className)}
            alt={alt ? alt : this.props.name}
            {...props}
          />
        );
      }

      default: {
        return null;
      }
    }
  }

  getRequestedContentType(): string {
    const { name, text, placeholder, imageProps } = this.props;

    return imageProps
      ? 'image'
      : text || name
      ? 'text'
      : placeholder
      ? 'placeholder'
      : DEFAULT_CONTENT_TYPE;
  }

  getCurrentContentType() {
    const requestedType = this.getRequestedContentType();

    if (requestedType === 'image' && !this.state.imageLoaded) {
      const { name, text, placeholder } = this.props;
      return text || name
        ? 'text'
        : placeholder
        ? 'placeholder'
        : DEFAULT_CONTENT_TYPE;
    }
    return requestedType;
  }

  loadImage() {
    this.image = new Image();
    this.image.onload = () => {
      this.setState({ imageLoaded: true });
    };
    this.image.src = this.props.imageProps.src;
  }

  unloadImage() {
    // TODO: Is this necessary? It is taken from https://github.com/mbrevda/react-image/blob/c402ed3f5d54b88e51eca3326a1e81d964995795/src/index.js#L146
    delete this.img.onload;
    try {
      delete this.img.src;
    } catch (e) {
      // On Safari in Strict mode this will throw an exception,
      //  - https://github.com/mbrevda/react-image/issues/187
      // We don't need to do anything about it.
    }
    delete this.img;
  }
}

export default Avatar;
