import React from 'react';
import PropTypes from 'prop-types';

// This is a copy of https://github.com/CassetteRocks/react-infinite-scroller with https://github.com/CassetteRocks/react-infinite-scroller/pull/38/files merged
class InfiniteScroll extends React.Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    initialLoad: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    threshold: PropTypes.number,
    useWindow: PropTypes.bool,
    isReverse: PropTypes.bool,
    scrollElement: PropTypes.object,
    children: PropTypes.node,
    loader: PropTypes.node,
  };

  static defaultProps = {
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    scrollElement: null,
  };

  constructor(props) {
    super(props);

    this.scrollListener = this.scrollListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart;
    this.attachScrollListener();
    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  render() {
    const { children, hasMore, loader, scrollElement, dataHook } = this.props;
    let ref;

    if (scrollElement) {
      ref = () => (this.scrollComponent = scrollElement);
    } else {
      ref = node => (this.scrollComponent = node);
    }

    return React.createElement(
      'div',
      { ref, 'data-hook': dataHook },
      children,
      hasMore && (loader || this._defaultLoader),
    );
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  scrollListener() {
    const el = this.scrollComponent;
    let offset;

    if (this.props.scrollElement) {
      if (this.props.isReverse) {
        offset = el.scrollTop;
      } else {
        offset = el.scrollHeight - el.scrollTop - el.clientHeight;
      }
    } else if (this.props.useWindow) {
      const scrollTop =
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop;
      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset =
          this.calculateTopPosition(el) +
          el.offsetHeight -
          scrollTop -
          window.innerHeight;
      }
    } else if (this.props.isReverse) {
      offset = el.parentNode.scrollTop;
    } else {
      offset =
        el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
    }

    if (offset < Number(this.props.threshold)) {
      this.detachScrollListener();
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore((this.pageLoaded += 1));
      }
    }
  }

  attachScrollListener() {
    this.detachScrollListener();

    if (!this.props.hasMore) {
      return;
    }

    let scrollEl = window;
    if (this.props.scrollElement) {
      scrollEl = this.scrollComponent;
    } else if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.addEventListener('scroll', this.scrollListener);
    scrollEl.addEventListener('resize', this.scrollListener);

    this.detachScrollListener = () => {
      scrollEl.removeEventListener('scroll', this.scrollListener);
      scrollEl.removeEventListener('resize', this.scrollListener);
      this.detachScrollListener = () => {};
    };
  }

  detachScrollListener = () => {};

  // Set a default loader for all your `InfiniteScroll` components
  setDefaultLoader(loader) {
    this._defaultLoader = loader;
  }
}

export default InfiniteScroll;
