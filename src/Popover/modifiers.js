import PopperJS from 'popper.js';

const getUnit = value => {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
};

const calculateOffset = ({ moveBy, placement = '' }): string => {
  /*
   * For `right` and `left` placements, we need to flip the `x` and `y` values as Popper.JS will use
   * the first value for the main axis. As per Popper.js docs:
   *
   *   if the placement is top or bottom, the length will be the width. In case of left or right, it
   *   will be the height.
   *
   */
  if (placement.includes('right') || placement.includes('left')) {
    return [moveBy ? moveBy.y : 0, moveBy ? moveBy.x : 0];
  }

  return [moveBy ? moveBy.x : 0, moveBy ? moveBy.y : 0];
};

// interface styles {
//   minWidth?: string;
//   width?: string;
// }

const resolveWidth = ({
  width,
  minWidth,
  dynamicWidth,
  referenceWidth,
}): styles => {
  console.log(
    'dshdsds',
    width,
    minWidth,
    dynamicWidth,
    referenceWidth,
  );
  return {
    minWidth: dynamicWidth ? `${referenceWidth}px` : getUnit(minWidth),
    width: width || 'auto',
  };
};

export const createModifiers = ({
  appendTo,
  placement,
  moveBy,
  shouldAnimate,
  flip,
  fixed,
  width,
  minWidth,
  dynamicWidth,
  isTestEnv,
}) => {
  const preventOverflow = !fixed;

  // const modifiers: PopperJS.Modifiers = {
  // const modifiers = {
  //   offset: {
  //     offset: calculateOffset({ moveBy, placement }),
  //   },
  //   computeStyle: {
  //     gpuAcceleration: !shouldAnimate,
  //     adaptive: !shouldAnimate,
  //   },
  //   flip: {
  //     enabled: typeof flip !== 'undefined' ? flip : !moveBy,
  //   },
  //   preventOverflow: {
  //     enabled: preventOverflow,
  //   },
  //   hide: {
  //     enabled: preventOverflow,
  //   },
  // };
  const modifiers = [
    {
      name: 'offset',
      options: {
        offset: calculateOffset({ moveBy, placement }),
      },
    },
    {
      name: 'computeStyle',
      options: {
        gpuAcceleration: !shouldAnimate,
        adaptive: !shouldAnimate,
      },
    },
    {
      name: 'flip',
      enabled: typeof flip !== 'undefined' ? flip : !moveBy,
    },
    {
      name: 'preventOverflow',
      enabled: preventOverflow,
    },
    {
      name: 'hide',
      enabled: preventOverflow,
    },
  ];

  if (dynamicWidth || minWidth || width) {
    // modifiers.setPopperWidth = {
    //   enabled: true,
    //   order: 840,
    //   fn: data => {
    //     const { width: referenceWidth } = data.offsets.reference;
    //
    //     data.styles = {
    //       ...data.styles,
    //       ...resolveWidth({
    //         width,
    //         referenceWidth,
    //         minWidth,
    //         dynamicWidth,
    //       }),
    //     };
    //
    //     return data;
    //   },
    // };
    modifiers.push({
      name: 'setPopperWidth',
      enabled: true,
      order: 840,
      fn: data => {
        const { width: referenceWidth } = data.offsets.reference;

        data.styles = {
          ...data.styles,
          ...resolveWidth({
            width,
            referenceWidth,
            minWidth,
            dynamicWidth,
          }),
        };

        return data;
      },
    });
  }

  if (isTestEnv) {
    // modifiers.computeStyle = { enabled: false };
  }

  if (appendTo) {
    // modifiers.preventOverflow = {
    //   ...modifiers.preventOverflow,
    //   boundariesElement: appendTo,
    // };
    modifiers[3] = {
      ...modifiers[3],
      options: {
        boundariesElement: appendTo,
      },
    };
  }

  return modifiers;
};
