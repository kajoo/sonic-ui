const draggableDriverFactory = ({ element, wrapper, component }) => {
  return {
    wrapper,
    exists: () => !!element,
    childByHook: hook => element.querySelector(`[data-hook="${hook}"]`),
    component,
  };
};

export default draggableDriverFactory;
