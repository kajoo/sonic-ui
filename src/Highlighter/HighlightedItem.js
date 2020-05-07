import React from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';

class HighlightedItem extends React.PureComponent {
  static propTypes = {
    match: PropTypes.string,
    caseSensitive: PropTypes.bool,
  };

  renderElement() {
    const { children, match } = this.props;

    if (match) {
      const matchRegExp = this.getMatchRegExp();

      return this.highlightChildren(children, matchRegExp);
    }

    return children;
  }

  getMatchRegExp() {
    const { match, caseSensitive } = this.props;
    return new RegExp(escapeRegExp(match), caseSensitive ? '' : 'i');
  }

  getMatchBoundaries(subject, matchRegExp) {
    const matches = matchRegExp.exec(subject);

    if (matches) {
      return {
        first: matches.index,
        last: matches.index + matches[0].length,
      };
    }
  }

  getMatchReactKey(index) {
    return `match-index-${index}`;
  }

  highlightChildren(children, matchRegExp) {
    const processedChildren = [];
    let matchIndex = 0;

    while (children) {
      if (!matchRegExp.test(children)) {
        processedChildren.push(
          this.renderPlain(children, this.getMatchReactKey(matchIndex++)),
        );
        return processedChildren;
      }

      const boundaries = this.getMatchBoundaries(children, matchRegExp);
      const nonMatch = children.slice(0, boundaries.first);

      if (nonMatch) {
        processedChildren.push(
          this.renderPlain(nonMatch, this.getMatchReactKey(matchIndex++)),
        );
      }

      const match = children.slice(boundaries.first, boundaries.last);

      if (match) {
        processedChildren.push(
          this.renderHighlight(match, this.getMatchReactKey(matchIndex++)),
        );
      }

      children = children.slice(boundaries.last);
    }

    return processedChildren;
  }

  renderPlain(plainString, key) {
    return <span key={key}>{plainString}</span>;
  }

  renderHighlight(matchString, key) {
    return React.createElement('strong', { key }, matchString);
  }

  render() {
    return <span>{this.renderElement()}</span>;
  }
}

export default HighlightedItem;
